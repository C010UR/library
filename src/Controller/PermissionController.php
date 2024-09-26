<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Permission;
use App\Repository\PermissionRepository;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/v1/permission', name: 'permission_api_v1_', format: 'json')]
class PermissionController extends AbstractController
{
    public function __construct(
        private readonly PermissionRepository $permissionRepository,
        //        private readonly PermissionService $permissionService,
    ) {
    }

    #[Route('/list', name: 'list', methods: ['GET'])]
    #[IsGranted('SHOW_PERMISSIONS')]
    public function list(Request $request): JsonResponse
    {
        return new JsonResponse(
            $this->permissionRepository->findByParams($request->query->all(), true),
        );
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[IsGranted('SHOW_PERMISSIONS')]
    public function show(Permission $permission): JsonResponse
    {
        return new JsonResponse($permission->toArray(true));
    }

    #[Route('/name/{name}', name: 'show_by_name', methods: ['GET'])]
    #[IsGranted('SHOW_PERMISSIONS')]
    public function showByName(#[MapEntity(mapping: ['name' => 'name'])] Permission $permission): JsonResponse
    {
        return new JsonResponse($permission->toArray(true));
    }

    //    CAN ONLY MODIFY FROM THE CODE
    //    #[Route('/create', name: 'create', methods: ['POST'])]
    //    #[IsGranted('SHOW_PERMISSIONS:UPDATE_PERMISSIONS')]
    //    public function create(Request $request): JsonResponse
    //    {
    //        $permission = new Permission();
    //
    //        $form = $this->createForm(PermissionType::class, $permission);
    //        FormHelper::submit($request, $form, true);
    //
    //        $this->permissionService->createPermission($permission);
    //
    //        return new JsonResponse($permission->toArray(true));
    //    }
    //
    //    #[Route('/{id}/update', name: 'update', methods: ['POST'])]
    //    #[IsGranted('SHOW_PERMISSIONS:UPDATE_PERMISSIONS')]
    //    public function update(Request $request, Permission $permission): JsonResponse
    //    {
    //        $form = $this->createForm(PermissionType::class, $permission);
    //        FormHelper::submit($request, $form, false);
    //
    //        $this->permissionService->updatePermission($permission);
    //
    //        return new JsonResponse($permission->toArray(true));
    //    }
    //
    //    #[Route('/{id}/remove', name: 'remove', methods: ['POST'])]
    //    #[IsGranted('SHOW_PERMISSIONS:UPDATE_PERMISSIONS')]
    //    public function register(Request $request, Permission $permission): JsonResponse
    //    {
    //        $this->permissionService->removePermission($permission);
    //
    //        return new JsonResponse();
    //    }
}
