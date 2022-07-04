import { SelectQueryBuilder, BaseEntity } from 'typeorm';
import { WcOperators, WcOperatorTypes, WcObjectAny, WhereAttributes, IModelIncludeOptions } from '../interfaces/DBUtilsOptions';

declare type ClassType<T> = {
  new (...args: any[]): T;
  [x: string]: any;
};

const isObject = (obj: any) => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;

/**
 * Generates a valid where caluse from an Object
 *
 * @deprecated Security risk (will be removed soon)
 * @param where Where Object
 * @param alias Clause alias
 */
export const whereClauseFromObject = (where: Object, alias?: string): string => {
  let wheres = [];

  for (let [key, value] of Object.entries(where)) {
    if (value) {
      const val = 'boolean' === typeof value ? value : `'${value}'`;
      wheres.push(`${alias ? `${alias}.` : ''}${key} = ${val}`);
    }
  }

  return wheres.join(' AND ');
};
/**
 * Generates where clause from an object
 *  This function was build for use with typeorm where clause types
 *
 * @param where
 * @param alias
 */
export const whereClauseFromObject2 = (where: WhereAttributes, alias?: string): { clause: string; parameters: Object } => {
  const parameters: WcObjectAny = {};

  /**
   * Get key name based on alias provided
   *
   * @param key
   */
  const getKeyName = (key: string) => `${alias ? `${alias}.` : ''}${key}`;

  const inClause = (keyAlias: string, key: string) => `${keyAlias} IN (:...${key})`;
  const eqClause = (keyAlias: string, key: string) => `${keyAlias} = :${key}`;
  const likeClause = (keyAlias: string, key: string) => `${keyAlias} LIKE :${key}`;

  /**
   * Generate clause for key based on operator
   *
   * @param key
   * @param value
   * @param operator
   */
  const genClause = (key: string, value: any, operator?: 'OR' | 'AND' | 'IN' | 'LIKE'): string => {
    const wheres: string[] = [];

    const keyName = getKeyName(key);

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        wheres.push(inClause(keyName, key));

        // Add parameters
        parameters[key] = value;
      } else {
        const wheres2: string[] = [];

        for (const val in value) {
          if (val in WcOperators) {
            if (val === WcOperators.$in) {
              if (!Array.isArray(value[val])) {
                throw 'For $IN operators, value must always be an array of values.';
              }

              wheres2.push(genClause(key, value[val], 'IN'));
            } else if (val === WcOperators.$like) {
              if (typeof value[val] !== 'string') {
                throw 'For $LIKE operators, value must always be a string.';
              }

              wheres2.push(genClause(key, value[val], 'LIKE'));
            } else {
              throw 'Only $IN and $LIKE operators are allowed in nested object.';
            }

            continue;
          }

          wheres2.push(genClause(val, value[val], operator));
        }

        wheres.push(wheres2.join(` ${operator?.toUpperCase()} `));
      }
    } else {
      if (operator === 'LIKE') {
        wheres.push(likeClause(keyName, key));
      } else {
        wheres.push(eqClause(keyName, key));
      }

      // Add parameters
      parameters[key] = value;
    }

    return wheres.join(` ${operator?.toUpperCase()} `);
  };
  /**
   * Sort operators and generate appropriate where clauses
   *
   * @param key
   * @param value
   */
  const sortOperators = (key: string, value: any): string[] => {
    const wheres: string[] = [];

    switch (key) {
      case WcOperators.$or:
        if (!isObject(value)) {
          throw 'For $OR operators, value must always be an object.';
        }

        wheres.push(genClause(key, value, 'OR'));
        break;
      case WcOperators.$in:
        if (!Array.isArray(value)) {
          throw 'For $IN operators, value must always be an array of values.';
        }

        wheres.push(genClause(key, value, 'IN'));
        break;
      case WcOperators.$like:
        wheres.push(genClause(key, value, 'LIKE'));
        break;
      default:
        wheres.push(genClause(key, value, 'AND'));
        break;
    }

    return wheres;
  };
  /**
   * Starting point
   *  Get all clauses,
   *
   * @param obj
   */
  const getClauses = (obj: WhereAttributes, operator: WcOperatorTypes = 'AND'): string[] => {
    const defaultClauses: string[] = [];
    const operatorClauses: WcObjectAny = {};

    if (Array.isArray(obj)) {
      throw 'Values cannot be an array without an $IN operator.';
    } else {
      for (let [key, value] of Object.entries(obj)) {
        if (key in WcOperators) {
          if (key === WcOperators.$and || key === WcOperators.$or) {
            operatorClauses[key] = getClauses(value, <WcOperatorTypes>key.replace('$', ''));
          }

          continue;
        }

        const wheres = sortOperators(key, value);

        wheres.forEach(clause => defaultClauses.push(clause));
      }
    }

    let cummDefaultClauses = [defaultClauses.join(` ${operator.toUpperCase()} `)];

    for (let op in operatorClauses) {
      cummDefaultClauses.push(operatorClauses[op].join(` ${op.replace('$', '').toUpperCase()} `));
    }

    return cummDefaultClauses;
  };

  /** Join all clauses */
  const clauses = getClauses(where)
    .map(cl => cl.trim())
    .filter(Boolean);
  let clause = '';

  if (clauses.length > 1) {
    clause = clauses.map(cl => `(${cl})`).join(' AND ');
  } else {
    clause = clauses.join();
  }

  if (clause.trim() === '') {
    throw 'Security error: Where clauses are expected to be used, they cannot be empty.';
  }

  return {
    clause,
    parameters,
  };
};
/**
 * Apply relations to typeorm query builder
 *
 * @param qb
 * @param include
 */
export const applyTypeormRelations = <T extends BaseEntity, K extends SelectQueryBuilder<T>>(qb: K, alias: string, include?: IModelIncludeOptions<string>, joinColumn?: string): K => {
  if (!include) return qb;

  include.forEach(tbl => {
    joinColumn = joinColumn || 'id';
    
    if ('object' === typeof tbl) {
      const joinAlias = tbl.alias || tbl.key;

      let joinOn = `${joinAlias}.${joinColumn} = ${alias}.${joinColumn}`,
        params;

      if ('string' === typeof tbl.on) {
        joinOn = tbl.on;
      }

      if ('object' === typeof tbl.on) {
        const { clause, parameters } = whereClauseFromObject2(tbl.on);

        joinOn = clause;
        params = parameters;
      }

      if (tbl.mapType === 'one') {
        qb.leftJoinAndMapOne(`${alias}.${tbl.key}`, tbl.entity, joinAlias, joinOn, params);
      }

      if (tbl.mapType === 'many') {
        qb.leftJoinAndMapMany(`${alias}.${tbl.key}`, tbl.entity, joinAlias, joinOn, params);
      }

      return;
    }

    qb.leftJoinAndMapMany(`${alias}.${tbl}`, tbl, tbl, `${tbl}.${joinColumn} = ${alias}.${joinColumn}`);
  });

  return qb;
};
