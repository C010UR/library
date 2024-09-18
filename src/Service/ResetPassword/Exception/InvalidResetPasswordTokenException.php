<?php

namespace App\Service\ResetPassword\Exception;

final class InvalidResetPasswordTokenException extends \Exception
{
    private const string MESSAGE = 'The reset password link is invalid. Please try to reset your password again';

    public function __construct(string $message = "", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message ?: self::MESSAGE, $code, $previous);
    }
}
