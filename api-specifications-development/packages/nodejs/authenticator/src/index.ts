import Axios from 'axios';
import { plainToClass } from 'class-transformer';
import { Cache } from 'memory-cache';
import { IConfigOptions, IServiceTokenDto } from './interfaces';
import { EXPIRY_OFFSET, ErrorCodes } from './constants';

const AuthCache = new Cache();

/**
 * Get timeout in milliseconds
 *
 * @param createdAt
 * @param expiresAt
 */
const getTimeoutMs = (expiresAt: string, createdAt: string): number => {
  const expiresMs = Date.parse(expiresAt);
  const createdMs = Date.parse(createdAt);

  return expiresMs - createdMs - EXPIRY_OFFSET;
};

class DistinctAuthenticator {
  private configOptions: IConfigOptions;

  constructor(configOptions: IConfigOptions) {
    this.configOptions = configOptions;
  }

  static config(configOptions: IConfigOptions): DistinctAuthenticator {
    return new DistinctAuthenticator(configOptions);
  }
  /**
   * Generate a new service token
   */
  async generateServiceToken(): Promise<IServiceTokenDto> {
    const { authUrl, payload, serviceId, serviceToken } = this.configOptions;

    // get service token from auth service
    const response = await Axios.post(
      `${authUrl}/services/token`,
      {
        payload,
      },
      {
        auth: {
          username: serviceId,
          password: serviceToken,
        },
      },
    ).catch(err => {
      const statusCode = err.response.status;

      if (statusCode === 402 || statusCode === 403) {
        throw {
          code: ErrorCodes.INVALID_AUTH,
          message: 'Invalid authentication details provided.',
        };
      }

      throw err;
    });

    // transform with class
    return plainToClass(IServiceTokenDto, response.data);
  }
  /**
   * Get service token request from cache or generate
   */
  async getServiceToken(): Promise<string> {
    const dataCache: any = AuthCache.get('token');

    if (!dataCache) {
      const serviceToken = await this.generateServiceToken();

      const timeout = getTimeoutMs(serviceToken.expiresAt, serviceToken.createdAt);

      AuthCache.put('token', serviceToken, timeout);

      return serviceToken.token;
    } else {
      return plainToClass(IServiceTokenDto, dataCache).token;
    }
  }
}

export { AuthCache };
export default DistinctAuthenticator;
