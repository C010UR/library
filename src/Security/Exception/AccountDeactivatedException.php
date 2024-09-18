<?php

namespace App\Security\Exception;

use Psr\Log\LogLevel;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\WithHttpStatus;
use Symfony\Component\HttpKernel\Attribute\WithLogLevel;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;

#[WithHttpStatus(Response::HTTP_UNAUTHORIZED, headers: ['WWW-Authenticate' => '-'])]
#[WithLogLevel(LogLevel::DEBUG)]
class AccountDeactivatedException extends CustomUserMessageAccountStatusException
{
    /**
     * @var string
     */
    final public const string MESSAGE = 'Too many attempts. Account was deactivated. Please reset the password';

    public function __construct()
    {
        parent::__construct(self::MESSAGE);
    }
}
