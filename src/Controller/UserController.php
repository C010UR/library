<?php

namespace App\Controller;

use App\Entity\Permission;
use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use App\Service\UserService;
use App\Utils\Helper\FormHelper;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/user', name: 'user_api_v1_', format: 'json')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserService $userService,
    ) {
    }

    #[Route('/list', name: 'list', methods: ['GET'])]
    #[IsGranted('SHOW_USERS')]
    public function list(Request $request): JsonResponse
    {
        return new JsonResponse(
            $this->userRepository->findByParams($request->query->all(), true),
        );
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[IsGranted('SHOW_USERS')]
    public function show(Request $request, User $user): JsonResponse
    {
        return new JsonResponse($user->toArray(true));
    }

    #[Route('/slug/{slug}', name: 'show_by_slug', methods: ['GET'])]
    #[IsGranted('SHOW_USERS')]
    public function showBySlug(Request $request, #[MapEntity(mapping: ['slug' => 'slug'])] User $user): JsonResponse
    {
        return new JsonResponse($user->toArray(true));
    }

    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('SHOW_USERS:UPDATE_USERS')]
    public function create(Request $request): JsonResponse
    {
        $user = new User();

        $form = $this->createForm(UserType::class, $user);
        FormHelper::submit($request, $form, true);

        $this->userService->createUser($user);

        return new JsonResponse($user->toArray(true));
    }

    #[Route('/{id}/update', name: 'update', methods: ['POST'])]
    #[IsGranted('SHOW_USERS:UPDATE_USERS')]
    public function update(Request $request, User $user): JsonResponse
    {
        $form = $this->createForm(UserType::class, $user);
        FormHelper::submit($request, $form, false);

        $this->userService->updateUser($user);

        return new JsonResponse($user->toArray(true));
    }

    #[Route('/{id}/remove', name: 'remove', methods: ['POST'])]
    #[IsGranted('SHOW_USERS:UPDATE_USERS')]
    public function remove(Request $request, User $user): JsonResponse
    {
        $this->userService->removeUser($user);

        return new JsonResponse();
    }

    #[Route('/{id}/permissions/{permissionId}/add', name: 'permission_add', methods: ['POST'])]
    #[IsGranted('SHOW_USERS:MANAGE_PERMISSIONS')]
    public function addPermission(
        Request $request,
        User $user,
        #[MapEntity(mapping: ['permissionId' => 'id'])] Permission $permission,
    ): JsonResponse {
        $user = $this->userService->addPermissionsToUser($user, $permission);

        return new JsonResponse($user->toArray(true));
    }

    #[Route('/{id}/permissions/{permissionId}/remove', name: 'permission_remove', methods: ['POST'])]
    #[IsGranted('SHOW_USERS:MANAGE_PERMISSIONS')]
    public function removePermission(
        Request $request,
        User $user,
        #[MapEntity(mapping: ['permissionId' => 'id'])] Permission $permission,
    ): JsonResponse {
        $user = $this->userService->removePermissionsFromUser($user, $permission);

        return new JsonResponse($user->toArray(true));
    }

    #[Route('/{id}/permissions/clone/from/{fromId}', name: 'permission_clone', methods: ['POST'])]
    #[IsGranted('SHOW_USERS:MANAGE_PERMISSIONS')]
    public function clonePermissions(
        Request $request,
        User $user,
        #[MapEntity(mapping: ['fromId' => 'id'])] User $from,
    ): JsonResponse {
        $user = $this->userService->clonePermissions($from, $user);

        return new JsonResponse($user->toArray(true));
    }
}
