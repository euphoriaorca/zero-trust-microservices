import faker from 'faker';

import { Applications } from '../../models';
import { AppsService } from '../../services';
import { ErrorCode } from '../../constants';

describe('Applications service test', () => {
  describe('Finding app by Id', () => {
    const appId = faker.random.uuid();

    it('App not found', async () => {
      Applications.findApplication = jest.fn().mockResolvedValue(null);

      try {
        await AppsService.findAppById(appId);
      } catch (err) {
        expect(err.code).toEqual(ErrorCode.RESOURCE_NOT_FOUND);
      }
    });

    it('App found', async () => {
      Applications.findApplication = jest.fn().mockResolvedValue({
        appId,
      });

      const app = await AppsService.findAppById(appId);

      expect(app).toEqual({
        appId,
      });
    });
  });
});
