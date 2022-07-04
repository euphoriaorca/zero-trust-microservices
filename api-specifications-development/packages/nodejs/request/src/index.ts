import Axios, { AxiosRequestConfig } from 'axios';
import { IfTransformFromClass } from './Transformer';
import { ClassType, IConfigOptions, TransformClassType } from './interfaces';

class Request {
  private configOptions: IConfigOptions;

  constructor(configOptions: IConfigOptions) {
    this.configOptions = configOptions;
  }

  static config(configOptions: IConfigOptions): Request {
    return new Request(configOptions);
  }

  /**
   * Prepares request options
   *
   * @param axiosOpts
   * @param authToken
   */
  private prepareOptions(axiosOpts: AxiosRequestConfig, authToken: string): Object {
    /* eslint-disable-next-line */
    const { url, method, headers, data, ...requestOptions } = axiosOpts || {};

    let options = {
      ...requestOptions,
      headers: {
        ...(headers || {}),
        'x-auth-token': authToken,
      },
    };

    return { data, ...options };
  }

  /**
   * Makes a GET request
   *
   * @param endpoint
   * @param options
   */
  async get<T>(
    endpoint: string,
    options?: AxiosRequestConfig | null,
    transformFromClass?: ClassType<T>,
  ): Promise<TransformClassType<T>> {
    try {
      const responseData = (await Axios.get(endpoint, options || {})).data;

      return IfTransformFromClass(responseData, transformFromClass);
    } catch (err) {
      this.configOptions.logError && this.configOptions.logError(err);
      this.configOptions.handleErrorCodes(err.response.status || 503, 'Service unavailable.', err);

      throw err;
    }
  }

  /**
   * Makes a POST request
   *
   * @param endpoint
   * @param data
   * @param options
   */
  async post<T>(
    endpoint: string,
    options?: AxiosRequestConfig | null,
    transformFromClass?: ClassType<T>,
  ): Promise<TransformClassType<T>> {
    try {
      let postData, requestOptions;

      if (options) {
        const { data, ...rest } = options!;

        postData = data;
        requestOptions = rest;
      }

      const responseData = (await Axios.post(endpoint, postData, requestOptions)).data;

      return IfTransformFromClass(responseData, transformFromClass!);
    } catch (err) {
      this.configOptions.logError && this.configOptions.logError(err);
      this.configOptions.handleErrorCodes(err.response.status || 503, 'Service unavailable.', err);

      throw err;
    }
  }

  /**
   * Makes a GET request
   *
   * @param endpoint
   * @param options
   */
  async delete<T>(
    endpoint: string,
    options?: AxiosRequestConfig | null,
    transformFromClass?: ClassType<T>,
  ): Promise<TransformClassType<T>> {
    try {
      const responseData = (await Axios.delete(endpoint, options || {})).data;

      return IfTransformFromClass(responseData, transformFromClass);
    } catch (err) {
      this.configOptions.logError && this.configOptions.logError(err);
      this.configOptions.handleErrorCodes(err.response.status || 503, 'Service unavailable.', err);

      throw err;
    }
  }

  /**
   * Makes a POST request to a service with service token
   *
   * @param endpoint
   * @param options
   */
  async postWithServiceToken<T>(
    endpoint: string,
    options?: AxiosRequestConfig,
    transformFromClass?: ClassType<T>,
  ): Promise<TransformClassType<T> > {
    const authToken: string = await this.configOptions.getServiceToken(); // Get service token from authenticator

    const opts = this.prepareOptions(options!, authToken);

    return await this.post(endpoint, opts, transformFromClass);
  }

  /**
   * Makes a GET request to a service with service token
   *
   * @param endpoint
   * @param options
   */
  async getWithServiceToken<T>(
    endpoint: string,
    options?: AxiosRequestConfig,
    transformFromClass?: ClassType<T>,
  ): Promise<TransformClassType<T> > {
    const authToken: string = await this.configOptions.getServiceToken(); // Get service token from authenticator

    const opts = this.prepareOptions(options!, authToken);

    return await this.get(endpoint, opts, transformFromClass);
  }

  /**
   * Makes a GET request to a service with service token
   *
   * @param endpoint
   * @param options
   */
  async deleteWithServiceToken<T>(
    endpoint: string,
    options?: AxiosRequestConfig,
    transformFromClass?: ClassType<T>,
  ): Promise<TransformClassType<T> > {
    const authToken: string = await this.configOptions.getServiceToken(); // Get service token from authenticator

    const opts = this.prepareOptions(options!, authToken);

    return await this.delete(endpoint, opts, transformFromClass);
  }
}

export * from './Transformer';
export default Request;
