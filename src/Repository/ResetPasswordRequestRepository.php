<?php

namespace App\Repository;

use App\Entity\ResetPasswordRequest;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ResetPasswordRequest>
 */
class ResetPasswordRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ResetPasswordRequest::class);
    }

    public function createResetPasswordRequest(
        User $user,
        \DateTimeInterface $expiresAt,
        string $selector,
        string $hashedToken,
    ): ResetPasswordRequest {
        return new ResetPasswordRequest($user, $expiresAt, $selector, $hashedToken);
    }

    public function save(ResetPasswordRequest $resetPasswordRequest, bool $flush = false): void
    {
        $this->getEntityManager()->persist($resetPasswordRequest);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findResetPasswordRequest(string $selector): ?ResetPasswordRequest
    {
        return $this->findOneBy(['selector' => $selector]);
    }

    public function getMostRecentNonExpiredRequestDate(User $user): ?\DateTimeInterface
    {
        /** @var ?ResetPasswordRequest $resetPasswordRequest */
        $resetPasswordRequest = $this->createQueryBuilder('reset_password_request')
            ->where('reset_password_request._user = :user')
            ->setParameter('user', $user)
            ->orderBy('reset_password_request.expiresAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        return null !== $resetPasswordRequest && !$resetPasswordRequest->isExpired()
            ? $resetPasswordRequest->getRequestedAt()
            : null;
    }

    public function removeByUser(User $user): void
    {
        $this->createQueryBuilder('reset_password_request')
            ->delete()
            ->where('reset_password_request._user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->execute();
    }

    public function remove(ResetPasswordRequest $resetPasswordRequest): void
    {
        $this->createQueryBuilder('reset_password_request')
            ->delete()
            ->where('reset_password_request._user = :user')
            ->setParameter(':user', $resetPasswordRequest->getUser())
            ->getQuery()
            ->execute();
    }

    public function removeExpiredResetPasswordRequests(): int
    {
        $time = new \DateTimeImmutable('-1 week');

        return $this->createQueryBuilder('reset_password_request')
            ->delete()
            ->where('reset_password_request.expiresAt <= :time')
            ->setParameter('time', $time)
            ->getQuery()
            ->execute();
    }
}
