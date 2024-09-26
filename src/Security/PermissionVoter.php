<?php

namespace App\Security;

use App\Entity\User;
use App\Enum\PermissionEnum;
use App\Service\PermissionService;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class PermissionVoter extends Voter
{
    public function __construct(
        private readonly PermissionService $permissionService,
    ) {
    }

    private function parseAttribute(string $attribute): array
    {
        return explode(':', $attribute);
    }

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        if ($subject instanceof User) {
            return true;
        }

        $attributes = $this->parseAttribute($attribute);
        $permissions = PermissionEnum::keys();

        foreach ($attributes as $_attribute) {
            if (!in_array($_attribute, $permissions)) {
                return false;
            }
        }

        return true;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        if ($subject instanceof User && $subject->getId() === $user->getId()) {
            return true;
        }

        return count($this->permissionService->userHasAccess($user, $this->parseAttribute($attribute))) === 0;
    }
}
