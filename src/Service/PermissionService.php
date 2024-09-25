<?php

namespace App\Service;

use App\Entity\Permission;
use App\Entity\User;
use App\Repository\PermissionRepository;
use App\Repository\UserRepository;
use App\Utils\Helper\ServiceHelper;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PermissionService
{
    use ServiceHelper;

    public function __construct(
        private readonly PermissionRepository $permissionRepository,
        private readonly UserRepository $userRepository,
    ) {
    }

    public function createPermission(array|Permission $permission): array|Permission
    {
        $pre = function (Permission &$permission): void {
            if ($this->permissionRepository->findOneByName($permission->getName()) instanceof Permission) {
                throw new BadRequestHttpException(sprintf('Permission with the name "%s" this name already exists', $permission->getName()));
            }
        };

        $process = function (array|Permission $permission): array|Permission {
            $this->permissionRepository->save($permission, true);

            return $permission;
        };

        return $this->processOneOrMany(
            $permission,
            $process,
            $pre,
        );
    }

    public function updatePermission(array|Permission $permission): array|Permission
    {
        $process = function (array|Permission $permission): array|Permission {
            $this->permissionRepository->save($permission, true);

            return $permission;
        };

        return $this->processOneOrMany(
            $permission,
            $process,
        );
    }

    public function removePermission(array|Permission $permission): void
    {
        $process = function (array|Permission $permission): array|Permission {
            $this->permissionRepository->remove($permission, true);

            return $permission;
        };

        $this->processOneOrMany(
            $permission,
            $process,
        );
    }

    public function userHasAccess(User $user, array|string $permissions): bool
    {
        $permissions = is_string($permissions) ? [$permissions] : $permissions;

        if ([] === $permissions) {
            return true;
        }

        $targetPermissions = $this->permissionRepository->findByUserAndNames($user, $permissions);

        return $permissions === array_map(fn (Permission $permission) => $permission->getName(), $targetPermissions);
    }
}
