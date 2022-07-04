import { whereClauseFromObject, whereClauseFromObject2 } from './index';

describe('"Where clause from object" generator tests', () => {
  let useWhere = {
    userId: '184fdf15-d458-4c3e-804f-0ed269c7e554',
    accountId: 'c07d7fce-76f2-43f5-bdf6-7b5d3eddd2c2',
  };

  let useWhere2 = {
    userId: '3793e700-a264-4630-b5f4-5941ae71eefd',
    accountId: 'e8a07680-2ec3-48bc-affc-4a8c5fc8a6c4',
    testWhere: null,
  };

  describe('Where clause generator type 1', () => {
    it('Should generate a valid where clause', () => {
      const { userId, accountId } = useWhere;

      // eslint-disable-next-line
      expect(whereClauseFromObject(useWhere)).toEqual(`userId = '${userId}' AND accountId = '${accountId}'`);
    });

    it('Should generate a valid where clause (Alias changed)', () => {
      const { userId, accountId } = useWhere;

      // eslint-disable-next-line
      expect(whereClauseFromObject(useWhere, 'acct')).toEqual(`acct.userId = '${userId}' AND acct.accountId = '${accountId}'`);
    });

    it('Should ignore invalid where properties', () => {
      const { userId, accountId } = useWhere2;

      expect(
        whereClauseFromObject({
          ...useWhere2,
          test: null,
        }),
      ).toEqual(`userId = '${userId}' AND accountId = '${accountId}'`);
    });
  });

  describe('Where clause generator type 2', () => {
    it('Generates basic where clause', () => {
      const { userId, accountId } = useWhere;

      const { clause, parameters } = whereClauseFromObject2({
        ...useWhere,
      });

      // eslint-disable-next-line
      expect(clause).toEqual(`userId = :userId AND accountId = :accountId`);
      expect(parameters).toEqual({ userId, accountId });
    });

    it('Generates where clause with $AND operator', () => {
      const { userId, accountId } = useWhere;

      const { clause, parameters } = whereClauseFromObject2({
        $and: {
          userId,
          accountId,
        },
      });

      expect(clause).toEqual(`userId = :userId AND accountId = :accountId`);
      expect(parameters).toEqual({ userId, accountId });
    });

    it('Generates where clause with $OR operator', () => {
      const { userId, accountId } = useWhere;

      const { clause, parameters } = whereClauseFromObject2({
        $or: {
          userId,
          accountId,
        },
      });

      expect(clause).toEqual(`userId = :userId OR accountId = :accountId`);
      expect(parameters).toEqual({ userId, accountId });
    });

    it('Generates where clause with a combination of $OR, $AND and $IN operators', () => {
      const { userId, accountId } = useWhere;

      const { clause, parameters } = whereClauseFromObject2({
        param1: 1,
        $and: {
          param2: 2,
          param3: 3,
        },
        $or: {
          userId,
          accountId,
        },
        param4: [1, 2, 3],
        param5: {
          $like: '1',
        },
      });

      expect(clause).toEqual(
        `(param1 = :param1 AND param4 IN (:...param4) AND param5 LIKE :param5) AND (param2 = :param2 AND param3 = :param3) AND (userId = :userId OR accountId = :accountId)`,
      );
      expect(parameters).toEqual({ param1: 1, param2: 2, param3: 3, param4: [1, 2, 3], param5: '1', userId, accountId });
    });
  });
});
