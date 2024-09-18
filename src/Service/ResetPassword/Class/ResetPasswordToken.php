<?php

namespace App\Service\ResetPassword\Class;

class ResetPasswordToken
{
    public function __construct(
        private string $token,
        private readonly \DateTimeInterface $expiresAt,
        private readonly \DateTimeInterface $generatedAt,
    ) {
    }

    public function getToken(): string
    {
        if (null === $this->token) {
            throw new \LogicException('The token property is not set. Calling getToken() after clearToken() is not allowed');
        }

        return $this->token;
    }

    public function clearToken(): void
    {
        $this->token = null;
    }

    public function getExpiresAt(): \DateTimeInterface
    {
        return $this->expiresAt;
    }

    public function getExpiresInMessage(): string
    {
        $interval = $this->getExpiresAtIntervalInstance();

        switch ($interval) {
            case $interval->y > 0:
                return $interval->y.' '.(1 === $interval->y ? 'year' : 'years');
            case $interval->m > 0:
                return $interval->m.' '.(1 === $interval->m ? 'month' : 'months');
            case $interval->d > 0:
                return $interval->d.' '.(1 === $interval->d ? 'day' : 'days');
            case $interval->h > 0:
                return $interval->h.' '.(1 === $interval->h ? 'hour' : 'hours');
            default:
                return $interval->m.' '.(1 === $interval->i ? 'minute' : 'minutes');
        }
    }

    public function getExpiresAtIntervalInstance(): \DateInterval
    {
        return $this->expiresAt->diff($this->generatedAt);
    }
}
