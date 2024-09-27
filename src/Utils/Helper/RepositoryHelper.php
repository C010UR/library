<?php

namespace App\Utils\Helper;

use App\Entity\Interface\IdAccessInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;

trait RepositoryHelper
{
    public const int PAGE_SIZE = 20;

    public const int DEFAULT_PAGE = 1;

    private function normalizeParams(array $params): array
    {
        $result = [];

        foreach ($params as $key => $param) {
            $result[strtolower($key)] = $param;
        }

        return $result;
    }

    private function handleOrderParams(
        QueryBuilder &$query,
        string $alias,
        array &$params,
        array $orderHandles,
    ): array {
        $result = [
            'orders' => [],
        ];

        if (count($orderHandles) === 0) {
            return $result;
        }

        if (array_key_exists('order', $params)) {
            $orders = is_array($params['order']) ? $params['order'] : [$params['order']];

            foreach ($orders as $field => $order) {
                $field = strtolower(trim($field));
                $order = strtolower(trim($order));

                if (
                    !array_key_exists($field, $orderHandles)
                    || ($order !== 'asc' && $order !== 'desc')
                ) {
                    continue;
                }

                $orderHandles[$field]($query, $alias, $order);
                $result['orders'][$field] = strtoupper($order);
            }
        }

        return $result;
    }

    private function handlePaginationParams(
        QueryBuilder &$query,
        string $alias,
        array &$params,
        bool $paginate,
    ): array {
        $pageSize = null;
        $page = null;

        if ($paginate) {
            $pageSize = $params['page_size'] ?? null;
            if ($pageSize === null || !filter_var($pageSize, FILTER_VALIDATE_INT) || (int)$pageSize < 1) {
                $pageSize = self::PAGE_SIZE;
            }

            $page = $params['page'] ?? null;
            if ($page === null || !filter_var($page, FILTER_VALIDATE_INT) || (int)$page < 1) {
                $page = self::DEFAULT_PAGE;
            }

            $query
                ->setMaxResults($pageSize)
                ->setFirstResult(($page - 1) * $pageSize);
        }

        unset($params['page_size']);
        unset($params['page']);

        return [
            'paginate' => true,
            'page_size' => $pageSize,
            'page' => $page,
        ];
    }

    private function handleFilterParams(
        QueryBuilder &$query,
        string $alias,
        array &$params,
        array $filterHandles,
    ): array {
        $result = [
            'filters' => [],
        ];

        if (count($filterHandles) === 0) {
            return $result;
        }

        foreach ($filterHandles as $key => $filter) {
            if (array_key_exists($key, $params)) {
                $value = is_string($params[$key]) ? trim($params[$key]) : $params[$key];
                $filter($query, $alias, $value);
                unset($params[$key]);

                $result['filters'][$key] = $value;
            }
        }

        return $result;
    }

    private function mapData(iterable $data, ?callable $mapHandle): array
    {
        $result = [];

        foreach ($data as $row) {
            assert(array_key_exists(IdAccessInterface::class, class_implements($row)));
            $result[] = is_null($mapHandle) ? $row : $mapHandle($row);
        }

        return $result;
    }

    private function filterByParams(
        QueryBuilder &$query,
        string $alias,
        array $params = [],
        array $filterHandles = [],
        array $orderHandle = [],
        ?callable $mapHandle = null,
        bool $paginate = true,
    ): array {
        $params = $this->normalizeParams($params);
        $countQuery = clone $query;
        $countParams = $params;

        $paginationMeta = $this->handlePaginationParams($query, $alias, $params, $paginate);
        $orderMeta = $this->handleOrderParams($query, $alias, $params, $orderHandle);
        $filterMeta = $this->handleFilterParams($query, $alias, $params, $filterHandles);

        $this->handleFilterParams($countQuery, $alias, $countParams, $filterHandles);

        $count = $countQuery
            ->select(sprintf('COUNT(DISTINCT(%s))', $alias))
            ->getQuery()
            ->getSingleScalarResult();

        $data = $paginate ? new Paginator($query->getQuery()) : $query->getQuery()->getResult();

        return [
            'meta' => $paginationMeta + $orderMeta + $filterMeta + ['count' => $count],
            'result' => $this->mapData($data, $mapHandle),
        ];
    }

    private function runForOneOrMany(array|object $data, string $class, callable $function): void
    {
        if (is_array($data)) {
            foreach ($data as $entry) {
                if (!$entry instanceof $class) {
                    throw new \LogicException(sprintf('"%s" cannot save "%s"', $class, $entry::class));
                }

                $function($entry);
            }
        } else {
            $function($data);
        }
    }
}
