<?php

namespace App\Service\ResetPassword\Exception;

final class TooManyPasswordRequestsException extends \Exception
{
    private const string MESSAGE = 'You have already requested a reset password email. Please check your email or try again soon';

    public function __construct(string $message = '', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message ?: self::MESSAGE, $code, $previous);
    }
}
