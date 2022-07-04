import { mockReq, mockRes } from 'sinon-express-mock';

import { Authentication } from '../../middlewares/Authentication';
import { ErrorCode } from '../../constants';
import { AdminUserService, AppsService } from '../../services';

describe('Authentication middlewares test suite', () => {
  describe('Validating admin user', () => {
    const authorization = 'Basic ZWQyYjc1YzctZDc1Ny00ZDkyLWEzN2MtZjM3NmQwYmRjMjdiOjAyZDQ3NTQ3NGI3OGUzMDA5NTIxZDk0MTRmNDEwNTcx';
    const userId = 'ed2b75c7-d757-4d92-a37c-f376d0bdc27b';
    const userToken = '02d475474b78e3009521d9414f410571';

    it('No authorization header', async () => {
      const req = mockReq({
        headers: {},
      });
      const res = mockRes();
      const nextFn = jest.fn();

      const fn = Authentication.validateAdminUser([]);

      try {
        await fn(req, res, nextFn);
      } catch (err) {
        expect(err.code).toEqual(ErrorCode.BAD_REQUEST);
      }

      expect(res.status.firstCall.args[0]).toEqual(400);
    });

    it('Authentication failed', async () => {
      const req = mockReq({
        headers: {
          authorization,
        },
      });
      const res = mockRes();
      const nextFn = jest.fn();

      AdminUserService.authenticateUser = jest.fn().mockRejectedValue({
        code: ErrorCode.RESOURCE_NOT_FOUND,
      });

      const fn = Authentication.validateAdminUser([]);

      await fn(req, res, nextFn);

      expect(res.status.firstCall.args[0]).toEqual(404);
      expect(AdminUserService.authenticateUser).toHaveBeenCalledWith(userId, userToken);
    });

    it('Does not have necessary permission(s)', async () => {
      const permissions = ['can.eat.food'];

      const req = mockReq({
        headers: {
          authorization,
        },
      });
      const res = mockRes();
      const nextFn = jest.fn();

      AdminUserService.authenticateUser = jest.fn().mockResolvedValue({
        permissions: ['can.drive.car'],
      });

      const fn = Authentication.validateAdminUser(permissions);

      await fn(req, res, nextFn);

      expect(res.status.firstCall.args[0]).toEqual(403);
    });

    it('User valid', async () => {
      const permissions = ['can.eat.food'];

      const req = mockReq({
        userId: undefined,
        headers: {
          authorization,
        },
      });
      const res = mockRes();
      const nextFn = jest.fn();

      AdminUserService.authenticateUser = jest.fn().mockResolvedValue({
        userId,
        permissions: ['can.eat.food'],
      });

      const fn = Authentication.validateAdminUser(permissions);

      await fn(req, res, nextFn);

      expect(req.userId).toEqual(userId);
      expect(nextFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validating application auth', () => {
    const authorization = 'Basic ZWQyYjc1YzctZDc1Ny00ZDkyLWEzN2MtZjM3NmQwYmRjMjdiOjAyZDQ3NTQ3NGI3OGUzMDA5NTIxZDk0MTRmNDEwNTcx';
    const appId = 'ed2b75c7-d757-4d92-a37c-f376d0bdc27b';
    const appToken = '02d475474b78e3009521d9414f410571';

    it('No authorization header', async () => {
      const req = mockReq({
        headers: {},
      });
      const res = mockRes();
      const nextFn = jest.fn();

      const fn = Authentication.validateAppAuth();

      try {
        await fn(req, res, nextFn);
      } catch (err) {
        expect(err.code).toEqual(ErrorCode.BAD_REQUEST);
      }

      expect(res.status.firstCall.args[0]).toEqual(400);
    });

    it('Authentication failed', async () => {
      const req = mockReq({
        headers: {
          authorization,
        },
      });
      const res = mockRes();
      const nextFn = jest.fn();

      AppsService.authenticateApp = jest.fn().mockRejectedValue({
        code: ErrorCode.RESOURCE_NOT_FOUND,
      });

      const fn = Authentication.validateAppAuth();

      await fn(req, res, nextFn);

      expect(res.status.firstCall.args[0]).toEqual(404);
      expect(AppsService.authenticateApp).toHaveBeenCalledWith(appId, appToken);
    });

    it('Auth valid', async () => {
      const permissions = ['can.do.something'];

      const req = mockReq({
        appId: undefined,
        permissions: undefined,
        headers: {
          authorization,
        },
      });
      const res = mockRes();
      const nextFn = jest.fn();

      AppsService.authenticateApp = jest.fn().mockResolvedValue({
        permissions,
      });

      const fn = Authentication.validateAppAuth();

      await fn(req, res, nextFn);

      expect(req.appId).toEqual(appId);
      expect(req.permissions).toEqual(permissions);
      expect(nextFn).toHaveBeenCalledTimes(1);
    });
  });
});
