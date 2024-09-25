import { QueryClient } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';

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
  pageSize?: number | undefined;
  page?: number | undefined;
  order?: 'ASC' | 'DESC' | undefined;
}

export interface FetchOption<T> extends ParamsOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
  withFiles?: boolean;
}

export class FetchError extends Error {
  status?: number;

  constructor(message?: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'FetchError';
  }
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
      const param = params[paramKey];

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
  }: FetchOption<InputType> = {},
): Promise<ReturnType> {
  try {
    const response = await axios({
      method: method,
      baseURL: API_URL + '/api/v' + API_VERSION,
      url: endpoint,
      withCredentials: true,
      params: parseParams({ params, pageSize, page, order }),
      data: method === 'GET' ? undefined : data,
      responseType: withFiles ? 'formdata' : 'json',
      timeout: 60000, // 1 minute
    });

    return response.data;
  } catch (error: Error | unknown) {
    if (isAxiosError(error) && error.response) {
      throw new FetchError(
        error.response.data?.message ??
          'There was an issue processing your request',
        error.response.data.status ?? error.response.status ?? 500,
      );
    } else if (error instanceof Error) {
      throw new FetchError(error.message, 500);
    } else {
      throw new FetchError(String(error), 500);
    }
  }
}

export const backendQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120000, // 2min
    },
  },
});
