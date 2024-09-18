<?php

namespace App\Repository;

use App\Doctrine\Helper\DoctrineHelper;
use App\Entity\Permission;
use App\Entity\User;
use App\Utils\Helper\RepositoryHelper;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Permission>
 */
class PermissionRepository extends ServiceEntityRepository
{
    use RepositoryHelper;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Permission::class);
    }

    public function save(array|Permission $permission, bool $flush = false): void
    {
        $this->runForOneOrMany(
            $permission,
            Permission::class,
            function (Permission $permission): void {
                $this->getEntityManager()->persist($permission);
            },
        );

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(array|Permission $permission, bool $flush = false): void
    {
        $this->runForOneOrMany(
            $permission,
            Permission::class,
            function (Permission $permission): void {
                $this->getEntityManager()->remove($permission);
            },
        );

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findOneByName(string $name): ?Permission
    {
        return $this->createQueryBuilder('permission')
            ->andWhere('permission.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByUserAndNames(User $user, array $permissions): array
    {
        return $this->createQueryBuilder('permission')
            ->leftJoin('permission.users', 'users')
            ->andWhere('users = :user')
            ->andWhere('permission.name IN(:permissions)')
            ->setParameter('user', $user)
            ->setParameter('permissions', $permissions)
            ->getQuery()
            ->getResult();
    }

    public function findByParams(array $params, bool $paginate = true): array
    {
        $query = $this->createQueryBuilder('permission')
            ->leftJoin('permission.users', 'users')
            ->addSelect('users');

        $filters = [
            'name' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                if (empty($value)) {
                    return $query;
                }

                return $query
                    ->andWhere('permission.name LIKE :name')
                    ->setParameter('name', DoctrineHelper::transformToLikeExpression((string)$value));
            },
            'description' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                if (empty($value)) {
                    return $query;
                }

                return $query
                    ->andWhere('FULL_TEXT_SEARCH(permission.description, :search) = true')
                    ->setParameter(':search', DoctrineHelper::transformToTsQuery($value));
            },
            'search' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                if (empty($value)) {
                    return $query;
                }

                return $query
                    ->andWhere('FULL_TEXT_SEARCH(permission.name, permission.description, :search) = true')
                    ->setParameter(':search', DoctrineHelper::transformToTsQuery($value));
            },
        ];

        return $this->filterByParams(
            $query,
            'permission',
            $params,
            $filters,
            fn(Permission $permission) => $permission->toArray(true),
            $paginate,
        );
    }
}
