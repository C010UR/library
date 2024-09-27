import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";

export interface SimplePaginationProps {
  page?: number;
  pageSize?: number;
  total?: number;
  pageGap?: number;
  onPageChange?: (page: number) => unknown;
  onPageSizeChange?: (pageSize: number) => unknown;
}

function SimplePagination({
  page = 1,
  pageSize = 20,
  total = 0,
  pageGap = 2,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}: SimplePaginationProps) {
  const firstPage = 1;
  const lastPage = Math.max(Math.floor(total / pageSize), 1);

  const changeRelative = (number: number) => onPageChange(page + number);
  const change = (number: number) => onPageChange(number);

  const changePageSize = (pageSize: string) => onPageSizeChange(Number(pageSize));

  function fillRange(from: number, to: number): Array<number> {
    if (from >= to) {
      return [];
    }
    const array = new Array(to - from);

    for (let i = 0; i < to - from; i++) {
      array[i] = from + i;
    }

    return array;
  }

  const getPreviousPages = () =>
    fillRange(Math.max(page - pageGap, firstPage + 1), page);
  const getNextPages = () =>
    fillRange(page + 1, Math.min(lastPage, page + pageGap + 1));

  return (
    <div className="flex flex-row space-x-4 items-center w-full justify-end">
      <div className="text-sm ">Total {total}</div>
      <Select defaultValue={String(pageSize)} onValueChange={changePageSize}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Page Size</SelectLabel>
            {[20, 40, 50, 100].map((number: number) => (
                <SelectItem key={number} value={String(number)}>{number}/page</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page - 1 <= 0}
              variant="ghost"
              onClick={() => changeRelative(-1)}
            />
          </PaginationItem>
          {page !== firstPage && (
            <PaginationItem>
              <PaginationLink variant="ghost" onClick={() => change(firstPage)}>
                {firstPage}
              </PaginationLink>
            </PaginationItem>
          )}
          {page - pageGap > firstPage + 1 && (
            <>
              {Array.from({
                length: Math.max(
                  page - (lastPage - pageGap * 2) + (3 - pageGap),
                  1,
                ),
              }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              ))}
            </>
          )}
          {getPreviousPages().map((_page: number) => (
            <PaginationItem key={_page}>
              <PaginationLink variant="ghost" onClick={() => change(_page)}>
                {_page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              isActive
              variant="ghost"
              onClick={() => change(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {getNextPages().map((_page: number) => (
            <PaginationItem key={_page}>
              <PaginationLink variant="ghost" onClick={() => change(_page)}>
                {_page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {page + pageGap < lastPage - 1 && (
            <>
              {Array.from({
                length: Math.max(pageGap * 2 + 1 + (3 - pageGap) - page, 1),
              }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              ))}
            </>
          )}
          {page !== lastPage && (
            <PaginationItem>
              <PaginationLink variant="ghost" onClick={() => change(lastPage)}>
                {lastPage}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={page + 1 > lastPage}
              variant="ghost"
              onClick={() => changeRelative(1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { SimplePagination };
