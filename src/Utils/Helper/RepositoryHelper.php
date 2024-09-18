<?php

namespace App\Utils\Helper;

use App\Entity\Interface\IdAccessInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;

trait RepositoryHelper
{
    public const int PAGE_SIZE = 20;
    public const int DEFAULT_PAGE = 1;

    private function filterByParams(
        QueryBuilder &$query,
        string $alias,
        array $params = [],
        array $filters = [],
        ?callable $map = null,
        bool $paginate = true,
    ): array {
        foreach ($filters as $key => $filter) {
            if (array_key_exists($key, $params)) {
                $query = $filter($query, $alias, is_string($params[$key]) ? trim($params[$key]) : $params[$key]);
            }
        }

        $pageSize = null;
        $page = 0;

        if ($paginate) {
            if (isset($params['page_size']) && filter_var($params['page_size'], FILTER_VALIDATE_INT)) {
                $pageSize = (int)$params['page_size'];
            } else {
                $pageSize = self::PAGE_SIZE;
            }

            if (isset($params['page']) && filter_var($params['page_size'], FILTER_VALIDATE_INT)) {
                $page = (int)$params['page'];
            } else {
                $page = self::DEFAULT_PAGE;
            }
            $query
                ->setMaxResults($pageSize)
                ->setFirstResult(($page - 1) * $pageSize);
        }

        $count = (clone $query)
            ->select(sprintf('COUNT(DISTINCT(%s))', $alias))
            ->getQuery()
            ->getSingleScalarResult();

        $result = [
            'meta' => [
                'paginated' => $paginate,
                'page_size' => $pageSize,
                'page' => $page,
                'count' => $count,
            ],
            'result' => [],
        ];

        if ($paginate) {
            $data = new Paginator($query->getQuery());
        } else {
            $data = $query->getQuery()->getResult();
        }

        foreach ($data as $row) {
            assert(array_key_exists(IdAccessInterface::class, class_implements($row)));
            $result['result'][$row->getId()] = is_null($map) ? $row : $map($row);
        }

        return $result;
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
