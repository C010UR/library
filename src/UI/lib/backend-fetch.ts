import axios, { AxiosError, isAxiosError } from 'axios';
import { OneOrMany, Scalar } from '@/types/types';

export const API_URL = import.meta.env.BACKEND_URL ?? 'http://localhost';
export const HOST_URL = import.meta.env.HOST_URL ?? 'http://localhost';
export const API_VERSION = import.meta.env.API_VERSION ?? 1;

interface ParamsOptions {
  params?:
    | {
        [key: string]: OneOrMany<Scalar>;
      }
    | undefined;
  pageSize?: Number | undefined;
  page?: Number | undefined;
  order?: 'ASC' | 'DESC' | undefined;
}

export interface FetchOption<T> extends ParamsOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
  withFiles?: boolean;
  isThrow?: boolean;
}

export interface FetchError {
  error: true;
  message: string;
  status: number;
}

function parseParams({
  params,
  pageSize,
  page,
  order,
}: ParamsOptions): URLSearchParams {
  const urlSearchParams = new URLSearchParams();

  if (params) {
    const mapParam = (param: Scalar): string => {
      if (param instanceof Date) {
        return param.toISOString().split('T')[0] ?? '';
      } else {
        return String(param);
      }
    };

    for (const paramKey in params) {
      let param = params[paramKey];

      if (Array.isArray(param)) {
        urlSearchParams.append(paramKey, param.map(mapParam).join(','));
      } else {
        urlSearchParams.append(paramKey, mapParam(param as Scalar));
      }
    }
  }

  if (pageSize) {
    urlSearchParams.append('page_size', String(pageSize));
  }

  if (page) {
    urlSearchParams.append('page', String(page));
  }

  if (order) {
    urlSearchParams.append('order', String(order));
  }

  return urlSearchParams;
}

export async function backendFetch<ReturnType, InputType>(
  endpoint: string,
  {
    method = 'GET',
    data = undefined,
    withFiles = false,
    params = undefined,
    pageSize = undefined,
    page = undefined,
    order = undefined,
    isThrow = true,
  }: FetchOption<InputType> = {},
): Promise<ReturnType | FetchError> {
  const _fetch = async () => {
    const result = await axios({
      method: method,
      baseURL: API_URL + '/api/v' + API_VERSION,
      url: endpoint,
      withCredentials: true,
      params: parseParams({ params, pageSize, page, order }),
      data: method === 'GET' ? undefined : data,
      responseType: withFiles ? 'formdata' : 'json',
      timeout: 60000, // 1 minute
    });

    return result.data;
  };

  if (isThrow) {
    return await _fetch();
  } else {
    try {
      return await _fetch();
    } catch (error: AxiosError | unknown) {
      if (isAxiosError(error) && error.response) {
        return {
          error: true,
          message: error.response.data.message,
          status: Number(error.response.status),
        };
      } else {
        return {
          error: true,
          message: String(error),
          status: 500,
        };
      }
    }
  }
}
