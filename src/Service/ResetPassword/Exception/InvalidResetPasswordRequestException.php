<?php

namespace App\Service\ResetPassword\Exception;

final class InvalidResetPasswordRequestException extends \Exception
{
    private const string MESSAGE = 'Something went wrong while processing your request. Please try to reset your password again';

    public function __construct(string $message = "", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message ?: self::MESSAGE, $code, $previous);
    }
}
