<?php

namespace App\Security\Exception;

use Psr\Log\LogLevel;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\WithHttpStatus;
use Symfony\Component\HttpKernel\Attribute\WithLogLevel;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;

#[WithHttpStatus(Response::HTTP_UNAUTHORIZED, headers: ['WWW-Authenticate' => '-'])]
#[WithLogLevel(LogLevel::DEBUG)]
class AccountInactiveException extends CustomUserMessageAccountStatusException
{
    /**
     * @var string
     */
    final public const string MESSAGE = 'Account is not active. Please reset the password to reactive account';

    public function __construct()
    {
        parent::__construct(self::MESSAGE);
    }
}
