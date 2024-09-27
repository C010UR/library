<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Form\ChangePasswordType;
use App\Form\ResetPasswordRequestType;
use App\Service\PermissionService;
use App\Service\ResetPassword\ResetPasswordService;
use App\Utils\Helper\FormHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api/v1/auth', name: 'auth_api_v1_', format: 'json')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly ResetPasswordService $resetPasswordService,
        private readonly PermissionService $permissionService,
    ) {
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse($user->toArray(true));
    }

    #[Route('/logout', name: 'logout', methods: ['GET'])]
    public function logout(): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return new JsonResponse();
    }

    #[Route('/profile', name: 'profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse($user->toArray(true));
    }

    #[Route('/check-access', name: 'check_access', methods: ['GET'])]
    public function checkAccess(Request $request): JsonResponse
    {
        if (!$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw new AccessDeniedException('User is not authenticated.');
        }

        /** @var User $user */
        $user = $this->getUser();

        $permissions = $request->query->all()['permissions'] ?? [];

        if (!is_array($permissions)) {
            $permissions = [$permissions];
        }

        if (
            count($permissions) === 0
            || trim($request->query->get('slug', '')) === $user->getSlug()
            || (int)trim($request->query->get('id', '0')) === $user->getId()
        ) {
            return new JsonResponse();
        }

        $permissions = array_map(
            fn(string $permission) => trim($permission),
            $permissions,
        );

        $missingPermissions = $this->permissionService->userHasAccess($user, $permissions);

        if (count($missingPermissions) > 0) {
            throw new AccessDeniedException(
                sprintf(
                    'User is not authorized on next permission(s): %s',
                    implode(', ', $missingPermissions),
                ),
            );
        }

        return new JsonResponse();
    }

    #[Route('/password/reset', name: 'request_reset_password', methods: ['POST'])]
    public function requestPasswordReset(Request $request): JsonResponse
    {
        $form = $this->createForm(ResetPasswordRequestType::class);
        FormHelper::submit($request, $form, true);

        $this->resetPasswordService->requestPasswordReset(
            $form->getData()['email'],
            $form->getData()['hook'],
        );

        return new JsonResponse();
    }

    #[Route('/password/reset/{token}', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(Request $request, string $token): JsonResponse
    {
        $form = $this->createForm(ChangePasswordType::class);
        FormHelper::submit($request, $form, true);

        $this->resetPasswordService->resetPassword($token, $form->getData()['password']);

        return new JsonResponse();
    }
}
