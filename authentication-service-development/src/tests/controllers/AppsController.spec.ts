import { mockReq, mockRes } from 'sinon-express-mock';
import faker from 'faker';

import { Logger } from '../../helpers';
import { AppsService } from '../../services';
import { ErrorCode } from '../../constants';
import { AppsController } from '../../controllers';
import { AppTypes } from '../../interfaces';

describe('Applications controller test suite', () => {
  beforeEach(() => {
    Logger.Info = jest.fn();
    Logger.Warn = jest.fn();
    Logger.Error = jest.fn();
  });

  describe('Registration', () => {
    it('Operation successful (201)', async () => {
      const userId = faker.random.uuid(),
        appType = AppTypes.BROWSER,
        domain = 'https://distinct.ai',
        description = 'Megas XLR';

      const req = mockReq({
        userId,
        body: {
          appType,
          domain,
          description,
        },
      });
      const res = mockRes();

      AppsService.registerApp = jest.fn().mockResolvedValue({});

      await AppsController.register(req, res);

      expect(AppsService.registerApp).toHaveBeenCalledWith(AppTypes.BROWSER, description, [], userId, domain);
      expect(res.status.firstCall.args[0]).toEqual(201);
      expect(res.json.firstCall.args[0]).toEqual({});
    });

    it('Operation failed (500)', async () => {
      const req = mockReq();
      const res = mockRes();

      AppsService.registerApp = jest.fn().mockRejectedValue({
        code: ErrorCode.SERVER_ERROR,
        message: 'An unexpected server error occurred.',
      });

      await AppsController.register(req, res);

      expect(res.status.firstCall.args[0]).toEqual(500);
    });
  });

  describe('Permissions update', () => {
    it('Operation successful (200)', async () => {
      const appId = faker.random.uuid(),
        permissions = ['perm1', 'perm2'];

      const req = mockReq({
        body: {
          appId,
          permissions,
        },
      });
      const res = mockRes();

      AppsService.updateAppPermissions = jest.fn().mockResolvedValue({});

      await AppsController.updatePermissions(req, res);

      expect(AppsService.updateAppPermissions).toHaveBeenCalledWith(appId, permissions);
      expect(res.status.firstCall.args[0]).toEqual(200);
      expect(res.json.firstCall.args[0]).toEqual({});
    });

    it('Operation failed (500)', async () => {
      const req = mockReq();
      const res = mockRes();

      AppsService.updateAppPermissions = jest.fn().mockRejectedValue({
        code: ErrorCode.SERVER_ERROR,
        message: 'An unexpected server error occurred.',
      });

      await AppsController.updatePermissions(req, res);

      expect(res.status.firstCall.args[0]).toEqual(500);
    });
  });

  describe('Token generation', () => {
    it('Operation successful (201)', async () => {
      const appId = faker.random.uuid();
      const payload = {};
      const permissions = ['perm1', 'perm2'];

      const req = mockReq({
        appId,
        permissions,
        body: {
          payload,
        },
      });
      const res = mockRes();

      AppsService.generateAppToken = jest.fn().mockResolvedValue({});

      await AppsController.generateToken(req, res);

      expect(AppsService.generateAppToken).toHaveBeenCalledWith(appId, permissions, payload);
      expect(res.status.firstCall.args[0]).toEqual(201);
      expect(res.json.firstCall.args[0]).toEqual({});
    });

    it('Operation failed (500)', async () => {
      const req = mockReq();
      const res = mockRes();

      AppsService.generateAppToken = jest.fn().mockRejectedValue({
        code: ErrorCode.SERVER_ERROR,
        message: 'An unexpected server error occurred.',
      });

      await AppsController.generateToken(req, res);

      expect(res.status.firstCall.args[0]).toEqual(500);
    });
  });
});
