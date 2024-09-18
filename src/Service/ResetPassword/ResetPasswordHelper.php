<?php

namespace App\Service\ResetPassword;

use App\Entity\ResetPasswordRequest;
use App\Entity\User;
use App\Repository\ResetPasswordRequestRepository;
use App\Service\ResetPassword\Class\ResetPasswordToken;
use App\Service\ResetPassword\Exception\ExpiredResetPasswordTokenException;
use App\Service\ResetPassword\Exception\InvalidResetPasswordTokenException;
use App\Service\ResetPassword\Exception\TooManyPasswordRequestsException;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ResetPasswordHelper
{
    /**
     * @var int How long a token is valid in seconds
     * @var int Another password reset cannot be made faster than this throttle time in seconds
     */
    public function __construct(
        private readonly ResetPasswordRequestRepository $repository,
        private readonly ResetPasswordTokenGenerator $tokenGenerator,
        private readonly int $resetRequestLifetime,
        private readonly int $requestThrottleTime,
    ) {
    }

    public function generateResetToken(User $user, ?int $resetRequestLifetime = null): ResetPasswordToken
    {
        $this->collectGarbage();

        if (($availableAt = $this->hasUserHitThrottling($user)) instanceof \DateTimeInterface) {
            throw new TooManyPasswordRequestsException($availableAt);
        }

        $resetRequestLifetime ??= $this->resetRequestLifetime;
        $generatedAt = new \DateTimeImmutable();
        $expiresAt = (clone $generatedAt)->modify(sprintf('+%d seconds', $resetRequestLifetime));

        $tokenComponents = $this->tokenGenerator->generate($expiresAt, $user->getId());

        $passwordResetRequest = $this->repository->createResetPasswordRequest(
            $user,
            $expiresAt,
            $tokenComponents->getSelector(),
            $tokenComponents->getHashedToken(),
        );

        $this->repository->save($passwordResetRequest, true);

        return new ResetPasswordToken(
            $tokenComponents->getPublicToken(),
            $expiresAt,
            $generatedAt,
        );
    }

    public function validateTokenAndFetchUser(string $token): User
    {
        $this->collectGarbage();

        if (40 !== strlen($token)) {
            throw new InvalidResetPasswordTokenException();
        }

        $resetPasswordRequest = $this->findResetPasswordRequest($token);

        if (!$resetPasswordRequest instanceof ResetPasswordRequest) {
            throw new InvalidResetPasswordTokenException();
        }

        if ($resetPasswordRequest->isExpired()) {
            throw new ExpiredResetPasswordTokenException();
        }

        $user = $resetPasswordRequest->getUser();

        $hashedVerifierToken = $this->tokenGenerator->generate(
            $resetPasswordRequest->getExpiresAt(),
            $user->getId(),
            substr($token, $this->tokenGenerator::SELECTOR_LENGTH),
        );

        if (false === hash_equals($resetPasswordRequest->getHashedToken(), $hashedVerifierToken->getHashedToken())) {
            throw new InvalidResetPasswordTokenException();
        }

        return $user;
    }

    public function removeResetRequest(string $token): void
    {
        $request = $this->findResetPasswordRequest($token);

        if (!$request instanceof ResetPasswordRequest) {
            throw new InvalidResetPasswordTokenException();
        }

        $this->repository->remove($request);
    }

    private function collectGarbage(): void
    {
        $this->repository->removeExpiredResetPasswordRequests();
    }

    private function findResetPasswordRequest(string $token): ?ResetPasswordRequest
    {
        $selector = substr($token, 0, $this->tokenGenerator::SELECTOR_LENGTH);

        return $this->repository->findResetPasswordRequest($selector);
    }

    private function hasUserHitThrottling(User $user): ?\DateTimeInterface
    {
        $lastRequestDate = $this->repository->getMostRecentNonExpiredRequestDate($user);

        if (!$lastRequestDate instanceof \DateTimeInterface) {
            return null;
        }

        $availableAt = (clone $lastRequestDate)->add(new \DateInterval(sprintf('PT%sS', $this->requestThrottleTime)));

        if ($availableAt > new \DateTime('now')) {
            return $availableAt;
        }

        return null;
    }
}
