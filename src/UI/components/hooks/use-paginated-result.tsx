import { useSearchParams } from 'react-router-dom';

import { normalizeParams, ParamsOptions } from '@/lib/backend-fetch.ts';
import { OneOrMany, Order, PaginatedResult, Scalar } from '@/types/types';

export default function usePaginatedResult<Type>(data: PaginatedResult<Type>) {
  const [_, setSearchParams] = useSearchParams();

  const _filters = data.meta.filters;
  const _order = data.meta.orders;
  const _pageSize = data.meta.page_size;
  const _page = data.meta.page;

  const handleChange = ({
    filters = undefined,
    order = undefined,
    pageSize = undefined,
    page = undefined,
  }: ParamsOptions) => {
    setSearchParams(
      normalizeParams({
        filters: filters ?? _filters,
        order: order ?? _order,
        pageSize: pageSize ?? _pageSize,
        page: page ?? _page,
      }),
    );
  };

  return {
    handleChange,
    setFilters: (filters: { [key: string]: OneOrMany<Scalar> }) =>
      handleChange({ filters }),
    setOrder: (order: { [key: string]: Order }) => handleChange({ order }),
    setPageSize: (pageSize: number) => handleChange({ pageSize }),
    setPage: (page: number) => handleChange({ page }),
    handleOrder: (key: string) => {
      const order = { ..._order };

      let newOrder: Order | undefined = 'ASC';

      if (order[key] === 'ASC') {
        newOrder = 'DESC';
      } else if (order[key] === 'DESC') {
        newOrder = undefined;
      }

      if (newOrder === undefined) {
        delete order[key];
      } else {
        order[key] = newOrder;
      }

      handleChange({ order });
    },
    paginated: Boolean(data.meta.paginated),
    pageSize: Number(data.meta.page_size),
    page: Number(data.meta.page),
    count: Number(data.meta.count),
    order: data.meta.orders,
    filters: data.meta.filters,
    data: data.result,
  };
}
