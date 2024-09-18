<?php

namespace App\EventListener;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\Exception\AccountDeactivatedException;
use App\Security\Exception\AccountInactiveException;
use App\Security\Exception\InvalidCredentialsException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Security\Http\Event\CheckPassportEvent;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

class AuthListener
{
    /**
     * @var int
     */
    final public const MAX_LOGIN_ATTEMPTS = 3;

    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    #[AsEventListener(event: LoginFailureEvent::class)]
    public function onLoginFailure(LoginFailureEvent $event): void
    {
        try {
            /** @var User $user */
            $user = $event->getPassport()->getUser();
        } catch (\Throwable) {
            throw new InvalidCredentialsException();
        }

        $this->validateUser($user);

        $attempts = $user->getLoginAttempts();

        if ($attempts < self::MAX_LOGIN_ATTEMPTS) {
            $user->setLoginAttempts(++$attempts);
            $this->userRepository->save($user, true);
            throw new InvalidCredentialsException();
        }

        $user->setLoginAttempts(0);
        $user->setActive(false);

        $this->userRepository->save($user, true);
        throw new AccountDeactivatedException();
    }

    #[AsEventListener(event: LoginSuccessEvent::class)]
    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        /** @var User $user */
        $user = $event->getUser();

        $this->validateUser($user);

        $user->setLoginAttempts(0);
        $this->userRepository->save($user, true);
    }

    #[AsEventListener(event: CheckPassportEvent::class)]
    public function onCheckPassport(CheckPassportEvent $event): void
    {
        try {
            /** @var User $user */
            $user = $event->getPassport()->getUser();
        } catch (\Throwable) {
            throw new InvalidCredentialsException();
        }

        $this->validateUser($user);
    }

    private function validateUser(User $user): void
    {
        if ($user->isDisabled()) {
            throw new InvalidCredentialsException();
        }

        if (!$user->isActive()) {
            throw new AccountInactiveException();
        }
    }
}
