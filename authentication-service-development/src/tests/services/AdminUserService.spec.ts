import faker from 'faker';
import bcrypt from 'bcryptjs';

import { AdminUsers } from '../../models';
import { AdminUserService } from '../../services';
import { ErrorCode } from '../../constants';

describe('Admin user service tests', () => {
  describe('User authentication', () => {
    const userId = faker.random.uuid();

    it('Request failed because user not found', async () => {
      AdminUsers.findUser = jest.fn().mockResolvedValue(null);

      try {
        await AdminUserService.authenticateUser(userId, '__PASSWORD__');
      } catch (err) {
        expect(err.code).toEqual(ErrorCode.REQUEST_FAILED);
      }
    });

    it('Passwords do not match', async () => {
      AdminUsers.findUser = jest.fn().mockResolvedValue({
        password: '__PASSWORD_HASH__',
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      try {
        await AdminUserService.authenticateUser(userId, '__PASSWORD__');
      } catch (err) {
        expect(err.code).toEqual(ErrorCode.FORBIDDEN);
      }
    });

    it('Authenticated', async () => {
      AdminUsers.findUser = jest.fn().mockResolvedValue({
        password: '__PASSWORD_HASH__',
        permissions: 'can.eat.food,can.drive.car',
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const user = await AdminUserService.authenticateUser(userId, '__PASSWORD__');

      expect(bcrypt.compare).toHaveBeenCalledWith('__PASSWORD__', '__PASSWORD_HASH__');
      expect(user).toEqual({
        userId,
        permissions: ['can.eat.food', 'can.drive.car'],
      });
    });
  });
});
