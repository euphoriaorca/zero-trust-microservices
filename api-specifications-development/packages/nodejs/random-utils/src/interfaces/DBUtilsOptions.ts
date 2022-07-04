export enum WcOperators {
  $or = '$or',
  $and = '$and',
  $in = '$in',
  $like = '$like',
}

export type WcOperatorTypes = 'AND' | 'OR';

type InOperator = string[] | number[];

type Values = String | Number | Date | boolean | String[] | Number[] | null | undefined;

type AndOperator = {
  [x: string]: Values;
}

type OrOperator = {
  [x: string]: Values;
}

type WhereOperators = {
  $in?: InOperator;
  $or?: OrOperator;
  $and?: AndOperator;
  $like?: String;
};

type StartOperators = {
  $and?: AndOperator;
  $or?: OrOperator;
};

export type WhereAttributes =
  | {
      [x: string]: WhereOperators | Values;
    }
  | StartOperators;

export type WcObjectAny = {
  [x: string]: any;
};

type MapTypes = 'one' | 'many';

type RelationOptions = {
  key: string;
  alias?: string;
  entity: Function;
  mapType: MapTypes;
  on?: string | WhereAttributes;
};

export type IModelIncludeOptions<T> = (T | RelationOptions)[];

export interface IModelOptions<T = string[]> {
  where: WhereAttributes;
  take?: number;
  skip?: number;
  orderBy?: {
    column: string;
    order: 'ASC' | 'DESC';
  };
  include?: IModelIncludeOptions<T>;
}
