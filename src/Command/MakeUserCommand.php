<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\PermissionRepository;
use App\Service\PermissionService;
use App\Service\UserService;
use App\Utils\Validator;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[AsCommand(
    name: 'app:make:user',
    description: 'Creates a User with all permissions',
)]
class MakeUserCommand extends Command
{
    public function __construct(
        private readonly UserService $userService,
        private readonly PermissionRepository $permissionRepository,
        private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function configure(): void
    {
        $this
            ->addArgument('firstname', InputArgument::OPTIONAL, 'User first name (e.g. <comment>Mikhail</>)')
            ->addArgument('lastname', InputArgument::OPTIONAL, 'User last name  (e.g. <comment>Buinouskiy</>)')
            ->addArgument(
                'middlename',
                InputArgument::OPTIONAL,
                'User middle name  (e.g. <comment>Valerievich</>), optional',
            )
            ->addArgument(
                'email',
                InputArgument::OPTIONAL,
                'User email (e.g. <comment>buinouskiy.mikhail@example.com</>)',
            )
            ->addArgument(
                'image',
                InputArgument::OPTIONAL,
                'User profile picture from the project directory (e.g. <comment>public/images/logo.jpg</>)',
            );
    }

    private function interactWithArgument(
        InputInterface $input,
        SymfonyStyle $io,
        string $name,
        callable $validator,
    ): void {
        if (null === $input->getArgument($name)) {
            $argument = $this->getDefinition()->getArgument($name);

            $question = new Question($argument->getDescription());
            $question->setValidator($validator);
            $question->setTrimmable(true);
            $question->setMaxAttempts(3);

            $input->setArgument($name, $io->askQuestion($question));
        }
    }

    #[\Override]
    protected function interact(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $this->interactWithArgument($input, $io, 'firstname', Validator::notBlank(...));
        $this->interactWithArgument($input, $io, 'lastname', Validator::notBlank(...));
        $this->interactWithArgument($input, $io, 'middlename', Validator::nullOrNotEmpty(...));
        $this->interactWithArgument($input, $io, 'email', Validator::email(...));
        $this->interactWithArgument($input, $io, 'image', Validator::nullOrFilePath(...));
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->comment('Creating the user...');
        $user = new User();

        $user
            ->setFirstname($input->getArgument('firstname'))
            ->setLastname($input->getArgument('lastname'))
            ->setMiddlename($input->getArgument('middlename'))
            ->setEmail($input->getArgument('email'));

        if ($input->getArgument('image')) {
            $uploadedFile = new UploadedFile(
                $this->projectDir . '/' . trim((string)$input->getArgument('image'), '\\/'),
                basename((string)$input->getArgument('image')),
            );

            $user->setImage($uploadedFile);
        }

        $io->comment('Saving the user...');
        $this->userService->createUser($user);
        $io->comment('Adding permissions to the user...');
        $this->userService->addPermissionsToUser($user, $this->permissionRepository->findAll());

        $io->success('You have successfully create a user!');

        return Command::SUCCESS;
    }
}
