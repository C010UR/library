import { QueryClient } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
// @ts-ignore
import qs from 'qs';

import { OneOrMany, Order, Scalar } from '@/types/types';

export const API_URL = import.meta.env.BACKEND_URL ?? 'http://localhost';
export const HOST_URL = import.meta.env.HOST_URL ?? 'http://localhost';
export const API_VERSION = import.meta.env.API_VERSION ?? 1;

export interface ParamsOptions {
  filters?:
    | {
        [key: string]: OneOrMany<Scalar>;
      }
    | undefined;
  order?: { [key: string]: Order };
  pageSize?: number | undefined;
  page?: number | undefined;
}

export interface FetchOption<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
  contentType?: 'application/json' | 'multipart/form-data';
  params?: ParamsOptions;
}

export class FetchError extends Error {
  status?: number;

  constructor(message?: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'FetchError';
  }
}

export function denormalizeParams(params: URLSearchParams): ParamsOptions {
  const parsedParams = qs.parse(params.toString());

  const result: ParamsOptions = {
    pageSize: parsedParams.page_size ?? undefined,
    page: parsedParams.page ?? undefined,
    order: parsedParams.order ?? undefined,
    filters: undefined,
  };

  delete parsedParams.page_size;
  delete parsedParams.page;
  delete parsedParams.order;

  result.filters = parsedParams;

  return result;
}

export function normalizeParams({
  filters,
  pageSize,
  page,
  order,
}: ParamsOptions): URLSearchParams {
  const urlSearchParams = new URLSearchParams();

  if (filters) {
    const mapFilter = (filter: Scalar): string => {
      if (filter instanceof Date) {
        return filter.toISOString().split('T')[0] ?? '';
      } else {
        return String(filter);
      }
    };

    for (const [filterKey, filter] of Object.entries(filters)) {
      if (filter === undefined) {
        continue;
      }

      if (Array.isArray(filter)) {
        for (const _param of filter) {
          urlSearchParams.append(filterKey + '[]', mapFilter(_param));
        }
      } else {
        urlSearchParams.append(filterKey, mapFilter(filter as Scalar));
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
    for (const [key, value] of Object.entries(order)) {
      urlSearchParams.append(`order[${key}]`, value);
    }
  }

  return urlSearchParams;
}

export async function backendFetch<ReturnType, InputType>(
  endpoint: string,
  {
    method = 'GET',
    data = undefined,
    contentType = 'application/json',
    params = undefined,
  }: FetchOption<InputType> = {},
): Promise<ReturnType> {
  try {
    const response = await axios({
      method: method,
      baseURL: API_URL + '/api/v' + API_VERSION,
      url: endpoint,
      withCredentials: true,
      params: params ? normalizeParams(params) : undefined,
      data: method === 'GET' ? undefined : data,
      headers: {
        'Content-Type': contentType,
      },
      responseType: 'json',
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
