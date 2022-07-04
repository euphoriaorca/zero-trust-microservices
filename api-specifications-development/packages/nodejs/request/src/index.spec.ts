import Axios from 'axios';
import faker from 'faker';
import Request from './index';

describe('Request helper test suite', () => {
  let request: Request, logError: any, getServiceToken: any, handleErrorCodes: any;

  beforeEach(() => {
    logError = jest.fn();
    getServiceToken = jest.fn().mockReturnValue('');
    handleErrorCodes = jest.fn();

    request = Request.config({
      logError,
      getServiceToken,
      handleErrorCodes,
    });
  });

  describe('Regular requests', () => {
    describe('GET request', () => {
      it('Should make regular GET request', async () => {
        const testId = faker.random.uuid();
        Axios.get = jest.fn().mockResolvedValue({
          data: {
            testId,
          },
        });

        const response = await request.get('__URL__');

        expect(Axios.get).toHaveBeenCalledWith('__URL__', {});
        expect(response).toEqual({
          testId,
        });
      });

      it('Should catch errors as SERVICE_UNAVAILABLE', async () => {
        Axios.get = jest.fn().mockRejectedValue({
          response: {
            status: 503,
          },
        });

        try {
          await request.get('__URL__');
        } catch (err) {
          expect(handleErrorCodes).toHaveBeenCalledTimes(1);
        }

        expect(logError).toHaveBeenCalledTimes(1);
      });
    });

    describe('POST request', () => {
      it('Should make regular POST request', async () => {
        const testId = faker.random.uuid();
        Axios.post = jest.fn().mockResolvedValue({
          data: {
            testId,
          },
        });

        const response = await request.post('__URL__', {
          data: {
            testId,
          },
          headers: {
            apiKey: 'abxyz',
          },
        });

        expect(Axios.post).toHaveBeenCalledWith(
          '__URL__',
          { testId },
          {
            headers: {
              apiKey: 'abxyz',
            },
          },
        );

        expect(response).toEqual({
          testId,
        });
      });

      it('Should catch errors as SERVICE_UNAVAILABLE', async () => {
        Axios.post = jest.fn().mockRejectedValue({
          response: {
            status: 503,
          },
        });

        try {
          await request.post('__URL__');
        } catch (err) {
          expect(handleErrorCodes).toHaveBeenCalledTimes(1);
        }

        expect(logError).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Requests with service token', () => {
    it('Should make a POST request with service token', async () => {
      const testId = faker.random.uuid();
      Axios.post = jest.fn().mockResolvedValue({
        data: {
          testId,
        },
      });

      const endpoint = '__URL__';
      const data = { test: true };

      const response = await request.postWithServiceToken(endpoint, {
        data,
      });

      expect(Axios.post).toHaveBeenCalledWith('__URL__', data, {
        headers: {
          'x-auth-token': '',
        },
      });
      expect(response).toEqual({
        testId,
      });
    });

    it('Should make a GET request with service token', async () => {
      const testId = faker.random.uuid();
      Axios.get = jest.fn().mockResolvedValue({
        data: {
          testId,
        },
      });

      const endpoint = '__URL__';

      const response = await request.getWithServiceToken(endpoint);

      expect(Axios.get).toHaveBeenCalledWith('__URL__', {
        headers: {
          'x-auth-token': '',
        },
      });
      expect(response).toEqual({
        testId,
      });
    });
  });
});
