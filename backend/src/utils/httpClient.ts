import { HttpException, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

////////////////////////////////////////////////////////////////////////////

type FetchParams = Record<string, any>;

type FetchConfig = Pick<
  AxiosRequestConfig,
  'data' | 'headers' | 'responseType'
>;

////////////////////////////////////////////////////////////////////////////////

export type HttpOptions = AxiosRequestConfig;

////////////////////////////////////////////////////////////////////////////////

export class HttpClient {
  private readonly logger = new Logger('HTTP');
  public axios: AxiosInstance;

  ////////////////////////////////////////////////////////////////////////////

  constructor(private readonly config: HttpOptions) {
    this.axios = axios.create({
      paramsSerializer: { indexes: null },
      timeout: 10000,
      ...this.config,
    });
  }

  ////////////////////////////////////////////////////////////////////////////

  async call(
    method: Method,
    path: string,
    config0: FetchConfig,
    params?: FetchParams,
  ): Promise<unknown> {
    // Update config
    const config = this.mergeConfig(method, path, config0, params);

    // Start fetch
    const startTime = process.hrtime.bigint();
    try {
      const res = await this.axios.request(config);
      const { data } = res;

      // Log
      this.logger.log(
        `succeed in issuing request: { method: ${method}, base: ${
          this.config.baseURL
        }, path: ${path}, params: ${params}, req: ${JSON.stringify(
          config.data,
        )}, res: ${JSON.stringify(data)}, startTime: ${startTime} }`,
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { code, message, response: res } = error;
        const data = res?.data ?? { code };
        this.logger.log(
          `failed to issue request: { method: ${method}, base: ${
            this.config.baseURL
          }, path: ${path}, params: ${params}, req: ${JSON.stringify(
            config.data,
          )}, message: ${message}, res: ${JSON.stringify(
            data,
          )}, startTime: ${startTime} }`,
        );
        throw new HttpException(message, res?.status ?? 500);
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////

  private mergeConfig(
    method: Method,
    url: string,
    config: FetchConfig,
    params?: FetchParams,
  ): AxiosRequestConfig {
    const headers = config.headers ?? {};

    // Pack
    return {
      method,
      url,
      params,
      headers,
      ...config,
    };
  }

  ////////////////////////////////////////////////////////////////////////////

  get(url: string, params?: FetchParams): Promise<unknown> {
    return this.call('GET', url, {}, params);
  }

  delete(url: string, params?: FetchParams): Promise<unknown> {
    return this.call('DELETE', url, {}, params);
  }

  post(
    url: string,
    data: Record<string, any>,
    params?: FetchParams,
  ): Promise<unknown> {
    return this.call('POST', url, { data }, params);
  }

  put(
    url: string,
    data: Record<string, any>,
    params?: FetchParams,
  ): Promise<unknown> {
    return this.call('PUT', url, { data }, params);
  }

  patch(
    url: string,
    data: Record<string, any>,
    params?: FetchParams,
  ): Promise<unknown> {
    return this.call('PATCH', url, { data }, params);
  }
}
