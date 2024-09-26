<?php

namespace App\Command;

use App\Entity\Permission;
use App\Enum\PermissionEnum;
use App\Repository\PermissionRepository;
use App\Service\PermissionService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:init',
    description: 'Initializes the project',
)]
class InitCommand extends Command
{
    public function __construct(
        private readonly PermissionService $permissionService,
        private readonly PermissionRepository $permissionRepository,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->comment('Creating permissions...');

        $permissions = [];

        foreach (PermissionEnum::all() as $name => $description) {
            if ($this->permissionRepository->findOneByName($name) === null) {
                $permission = new Permission();

                $permission
                    ->setName($name)
                    ->setDescription($description);

                $permissions[] = $permission;
            }
        }

        $io->comment('Saving permissions...');
        $this->permissionService->createPermission($permissions);

        $io = new SymfonyStyle($input, $output);
        $io->success('You have successfully initialized the project!');

        return Command::SUCCESS;
    }
}
