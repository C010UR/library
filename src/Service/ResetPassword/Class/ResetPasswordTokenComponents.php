<?php

namespace App\Service\ResetPassword\Class;

class ResetPasswordTokenComponents
{
    public function __construct(
        private readonly string $selector,
        private readonly string $verifier,
        private readonly string $hashedToken,
    ) {
    }

    public function getSelector(): string
    {
        return $this->selector;
    }

    public function getVerifier(): string
    {
        return $this->verifier;
    }

    public function getHashedToken(): string
    {
        return $this->hashedToken;
    }

    public function getPublicToken(): string
    {
        return $this->selector.$this->verifier;
    }
}
