<?php

namespace App\Repository;

use App\Doctrine\Helper\DoctrineHelper;
use App\Entity\User;
use App\Utils\Helper\RepositoryHelper;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    use RepositoryHelper;


    public function __construct(
        ManagerRegistry $registry,
        PermissionRepository $permissionRepository,
        private readonly ResetPasswordRequestRepository $resetPasswordRequestRepository,
    ) {
        parent::__construct($registry, User::class);
    }

    public function save(array|User $user, bool $flush = false): void
    {
        $this->runForOneOrMany(
            $user,
            User::class,
            function (User $user): void {
                $this->getEntityManager()->persist($user);
            },
        );

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(array|User $user, bool $flush = false): void
    {
        $this->runForOneOrMany(
            $user,
            User::class,
            function (User $user): void {
                $this->resetPasswordRequestRepository->removeByUser($user);
                $this->getEntityManager()->remove($user);
            },
        );

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    #[\Override]
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findOneBySlug(string $slug): ?User
    {
        return $this->createQueryBuilder('user')
            ->andWhere('user.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('user')
            ->andWhere('user.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByParams(array $params, bool $paginate = true): array
    {
        $query = $this->createQueryBuilder('user')
            ->leftJoin('user.permissions', 'permissions')
            ->addSelect('permissions');

        $filters = [
            'full_name' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                if (empty($value)) {
                    return $query;
                }

                return $query
                    ->andWhere('FULL_TEXT_SEARCH(user.email, user.firstname, user.lastname, :search) = true')
                    ->setParameter(':search', DoctrineHelper::transformToTsQuery($value));
            },
            'email' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                if (empty($value)) {
                    return $query;
                }

                return $query
                    ->andWhere('LOWER(user.email) LIKE :email')
                    ->setParameter('email', DoctrineHelper::transformToLikeExpression((string)$value));
            },
            'is_active' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                return $query
                    ->andWhere('LOWER(user.is_active) = :is_active')
                    ->setParameter('is_active', (bool)$value);
            },
            'is_dropped' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                return $query
                    ->andWhere('LOWER(user.is_dropped) = :is_dropped')
                    ->setParameter('is_dropped', (bool)$value);
            },
            'search' => function (QueryBuilder $query, string $alias, mixed $value): QueryBuilder {
                if (empty($value)) {
                    return $query;
                }

                return $query
                    ->andWhere('FULL_TEXT_SEARCH(user.email, user.firstname, user.lastname, user.middlename, :search) = true')
                    ->setParameter(':search', DoctrineHelper::transformToTsQuery($value));
            },
        ];

        return $this->filterByParams(
            $query,
            'user',
            $params,
            $filters,
            fn(User $user) => $user->toArray(true),
            $paginate,
        );
    }
}
