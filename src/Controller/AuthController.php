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

    #[Route('/has-access', name: 'has_access', methods: ['GET'])]
    public function hasAccess(Request $request): JsonResponse
    {
        if (!$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            return new JsonResponse(false);
        }

        /** @var User $user */
        $user = $this->getUser();
        $permissions = trim($request->query->get('permissions', ''));

        if (empty($permissions)) {
            return new JsonResponse(true);
        } else {
            $permissions = array_map(
                fn(string $permission) => trim($permission),
                explode(',', $request->query->get('permissions', '')),
            );
        }

        return new JsonResponse($user && $this->permissionService->userHasAccess($user, $permissions));
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
