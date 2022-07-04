import Axios from 'axios';
import DistinctAuthenticator, { AuthCache } from './index';

const serviceId = 'b886cd08-ae61-41c9-b4a5-37793b87771a';
const serviceToken = '05edce31262b4da0826ddc1b9241a450';

const Authenticator = DistinctAuthenticator.config({
  authUrl: '__DUMMY_URL__',
  serviceId,
  serviceToken,
});

const rawSampleToken = {
  serviceId: 'b886cd08-ae61-41c9-b4a5-37793b87771a',
  permissions: ['svcs.id.so-something', 'svcs.id.do.another-thing'],
  token:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblR5cGUiOiJTRVJWSUNFIiwic2VydmljZUlkIjoiYjg4NmNkMDgtYWU2MS00MWM5LWI0YTUtMzc3OTNiODc3NzFhIiwicGVybWlzc2lvbnMiOlsic3Zjcy5jYXNob3V0LnJlYWQuc2F2ZWQtYWNjb3VudHMiLCJzdmNzLmNhc2hvdXQuZGVsZXRlLnNhdmVkLWFjY291bnRzIiwic3Zjcy5jYXNob3V0LmNyZWF0ZS50cmFuc2FjdGlvbnMiLCJzdmNzLmNhc2hvdXQucmVhZC50cmFuc2FjdGlvbnMiLCJzdmNzLmF1dGhlbnRpY2F0aW9uLnVzZXIudG9rZW4uZ2VuZXJhdGUiLCJzdmNzLmJhbmtnYXRld2F5LmNyZWF0ZS5hY2NvdW50cyIsInN2Y3MuYmFua2dhdGV3YXkucmVhZC5hY2NvdW50cyIsInN2Y3MuYmFua2dhdGV3YXkucmVhZC50cmFuc2FjdGlvbnMiLCJzdmNzLmJhbmtnYXRld2F5LnRyYW5zYWN0aW9ucy5jcmVkaXQiLCJzdmNzLmJhbmtnYXRld2F5LnRyYW5zYWN0aW9ucy5kZWJpdCIsInN2Y3MuYmFua2dhdGV3YXkudHJhbnNhY3Rpb25zLnRyYW5zZmVyIiwic3Zjcy5iYW5rZ2F0ZXdheS50cmFuc2FjdGlvbnMucmV2ZXJzZSJdLCJpYXQiOjE1Nzg0MzczNzEsImV4cCI6MTU3ODQ0MDk3MSwiaXNzIjoiU1ZDUy9BVVRIIn0.Z1BgZbsBmKkqK0H98FfjH30yKi662IhA1aEg4Taa2L72m4KHB--wwgDUKFoPmVDFMPRBr_SIcdaE9SGVb6KRz2IITA9lKyBSZs8co-6bWpYeE3Fxk1XNhAGse5lDRQKyCaOTiLWjMhoXhMMjB0_4Klb_ONnybypXB182wWCx2xQ',
  createdAt: '2020-01-07T22:49:31.123Z',
  expiresAt: '2020-01-07T23:49:31.123Z',
};

describe('Authenticator test suite', () => {
  it('Should generate token', async () => {
    Axios.post = jest.fn().mockResolvedValue({
      data: rawSampleToken,
    });

    let auth: any;

    try {
      auth = await Authenticator.generateServiceToken();
    } catch (err) {
      console.log(err);
    }

    expect(Axios.post).toHaveBeenCalledTimes(1);
    expect(Axios.post).toHaveBeenCalledWith(
      `__DUMMY_URL__/services/token`,
      {},
      {
        auth: {
          username: serviceId,
          password: serviceToken,
        },
      },
    );
    expect(auth.token).toEqual(rawSampleToken.token);
  });

  describe('Get or generate token', () => {
    it('Should return cached token', async () => {
      AuthCache.get = jest.fn().mockReturnValue(rawSampleToken);

      let token = '';

      try {
        token = await Authenticator.getServiceToken();
      } catch (err) {
        console.log(err);
      }

      expect(AuthCache.get).toHaveBeenCalledTimes(1);
      expect(token).toEqual(rawSampleToken.token);
    });

    it('Should generate a new token if no token in cache', async () => {
      AuthCache.get = jest.fn().mockReturnValue(undefined);
      AuthCache.put = jest.fn();
      Authenticator.generateServiceToken = jest.fn().mockResolvedValue(rawSampleToken);

      let token = '';

      try {
        token = await Authenticator.getServiceToken();
      } catch (err) {
        console.log(err);
      }

      expect(AuthCache.get).toHaveBeenCalledTimes(1);
      expect(token).toEqual(rawSampleToken.token);
      expect(AuthCache.put).toHaveBeenCalledTimes(1);
      expect(AuthCache.put).toHaveBeenCalledWith('token', rawSampleToken, 3300000);
    });
  });
});
