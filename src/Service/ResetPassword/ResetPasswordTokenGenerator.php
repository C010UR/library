<?php

namespace App\Service\ResetPassword;

use App\Service\ResetPassword\Class\ResetPasswordRandomGeneratorInterface;
use App\Service\ResetPassword\Class\ResetPasswordTokenComponents;

class ResetPasswordTokenGenerator
{
    public const SELECTOR_LENGTH = 20;

    public const VERIFIER_LENGTH = 20;

    public function __construct(
        private readonly string $signingKey,
        private readonly ResetPasswordRandomGeneratorInterface $generator,
    ) {
    }

    public function generate(
        \DateTimeInterface $expiresAt,
        mixed $userId,
        ?string $verifier = null,
    ): ResetPasswordTokenComponents {
        if (null === $verifier) {
            $verifier = $this->generator->generate(self::VERIFIER_LENGTH);
        }

        $selector = $this->generator->generate(self::SELECTOR_LENGTH);

        $encodedData = $this->hashToken(json_encode(
            [
                'verifier' => $verifier,
                'user_id' => $userId,
                'expires_at' => $expiresAt->getTimestamp(),
            ],
        ));

        return new ResetPasswordTokenComponents($selector, $verifier, $encodedData);
    }

    private function hashToken(string $data): string
    {
        return base64_encode(hash_hmac('sha256', $data, $this->signingKey, true));
    }
}
