<?php

namespace App\Service\ResetPassword;

use App\Message\EmailMessage;
use App\Repository\EmailRepository;
use App\Repository\UserRepository;
use App\Service\ResetPassword\Exception\InvalidResetPasswordRequestException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Twig\Environment;

class ResetPasswordService
{
    public function __construct(
        private readonly EmailRepository $emailRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly Environment $twig,
        private readonly MessageBusInterface $bus,
        private readonly ResetPasswordHelper $resetPasswordHelper,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserRepository $userRepository,
    ) {
    }

    public function requestPasswordReset(string $email, string $hook, bool $isNewUser = false): void
    {
        $user = $this->userRepository->findOneBy([
            'email' => $email,
        ]);

        if (null === $user) {
            throw new InvalidResetPasswordRequestException();
        }

        $resetToken = $this->resetPasswordHelper->generateResetToken($user);

        $email = $this->emailRepository->createEmail(
            new Address('account@library.bsuir.edu', 'BSUIR Library Account Management'),
            $user->getEmail(),
            'Password Reset',
            $this->twig->load('Email/reset-password-email.html.twig')->render([
                'hook' => $hook,
                'resetToken' => $resetToken,
            ]),
        );

        $this->entityManager->persist($email);
        $this->entityManager->flush();

        $this->bus->dispatch(new EmailMessage($email->getId()));
    }

    public function resetPassword(string $token, #[\SensitiveParameter] string $password): void
    {
        if ('' === $token) {
            throw new BadRequestException('No password reset token provided.');
        }

        $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        $this->resetPasswordHelper->removeResetRequest($token);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);

        $user->setPassword($hashedPassword);
        $user->setLoginAttempts(0);
        $user->setActive(true);

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}
