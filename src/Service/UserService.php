<?php

namespace App\Service;

use App\Entity\Permission;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ResetPassword\ResetPasswordService;
use App\Utils\Helper\ServiceHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\String\Slugger\SluggerInterface;

class UserService
{
    use ServiceHelper;

    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly ResetPasswordService $resetPasswordService,
        private readonly SluggerInterface $slugger,
    ) {
    }

    public function createUser(array|User $user): array|User
    {
        $pre = function (User &$user): void {
            if ($this->userRepository->findOneByEmail($user->getEmail())) {
                throw new BadRequestHttpException(
                    sprintf('User with the email "%s" already exists', $user->getEmail()),
                );
            }

            $user->normalizeName();
            $user->computeSlug($this->slugger);
            $user->setPassword('');
        };

        $process = function (array|User $user): array|user {
            $this->userRepository->save($user, true);
            return $user;
        };

        $post = function (User $user): void {
            $this->resetPasswordService->requestPasswordReset(
                $user->getEmail(),
                $_ENV['RESET_PASSWORD_URL'] ?? 'http://localhost',
                true,
            );
        };

        return $this->processOneOrMany(
            $user,
            $process,
            $pre,
            $post,
        );
    }

    public function updateUser(array|User $user): array|User
    {
        $pre = function (User &$user): void {
            $user->normalizeName();
            $user->computeSlug($this->slugger);
        };

        $process = function (array|User $user): array|user {
            $this->userRepository->save($user, true);
            return $user;
        };

        return $this->processOneOrMany(
            $user,
            $process,
            $pre,
        );
    }

    public function removeUser(array|User $user): void
    {
        $process = function (array|User $user): array|user {
            $this->userRepository->remove($user, true);
            return $user;
        };

        $this->processOneOrMany(
            $user,
            $process,
        );
    }

    public function addPermissionsToUser(User $user, array|Permission $permissions): User
    {
        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }

        foreach ($permissions as $permission) {
            $user->addPermission($permission);
        }

        $this->userRepository->save($user, true);

        return $user;
    }

    public function removePermissionsFromUser(User $user, array|Permission $permissions): User
    {
        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }

        foreach ($permissions as $permission) {
            $user->removePermission($permission);
        }

        $this->userRepository->save($user, true);

        return $user;
    }

    public function clonePermissions(User $from, User $to): User
    {
        $to->removeAllPermissions();

        foreach ($from->getPermissions() as $permission) {
            $to->addPermission($permission);
        }

        $this->userRepository->save($to, true);

        return $to;
    }
}
