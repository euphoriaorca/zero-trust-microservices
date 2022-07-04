import bcrypt from 'bcryptjs';

import { IAdminUser } from '../interfaces';
import { AdminUsers } from '../models';
import { ErrorCode } from '../constants';
import { permsToArray } from '../helpers';

export const AdminUserService = {
  /**
   * Verifies an Admin user by password
   *
   * @param userId
   * @param password
   */
  async authenticateUser(userId: string, password: string): Promise<IAdminUser> {
    const user = await AdminUsers.findUser({
      where: { userId },
    });

    if (!user) {
      throw {
        code: ErrorCode.REQUEST_FAILED,
        data: 'Access unauthorized (user)',
      };
    }

    const match: boolean = await bcrypt.compare(password, user.password);

    if (!match) {
      throw {
        code: ErrorCode.FORBIDDEN,
        data: 'Access unauthorized (password)',
      };
    }

    return {
      userId,
      permissions: permsToArray(user.permissions),
    };
  },
};
