<?php

namespace App\Entity;

use App\Entity\Interface\ArrayTransformableInterface;
use App\Entity\Interface\IdAccessInterface;
use App\Repository\UserRepository;
use App\Utils\Aws\S3Client;
use App\Utils\Utils;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface, ArrayTransformableInterface, IdAccessInterface,
                      \Stringable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     * @var Collection<int, Permission>
     */
    #[ORM\ManyToMany(targetEntity: Permission::class, inversedBy: 'users')]
    private Collection $permissions;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $middlename = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bucket = null;

    #[ORM\Column(nullable: true)]
    private ?array $contactInformation = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imageOriginalFilename = null;

    #[ORM\Column]
    private ?bool $isActive = false;

    #[ORM\Column]
    private ?int $loginAttempts = 0;

    #[ORM\Column]
    private ?bool $isDisabled = false;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    public function __construct()
    {
        $this->permissions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    #[\Override]
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @return list<string>
     *
     * @see UserInterface
     */
    #[\Override]
    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    #[\Override]
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    #[\Override]
    public function eraseCredentials(): void
    {
    }

    /**
     * @return Collection<int, Permission>
     */
    public function getPermissions(): Collection
    {
        return $this->permissions;
    }

    public function addPermission(Permission $permission): static
    {
        if (!$this->permissions->contains($permission)) {
            $this->permissions->add($permission);
        }

        return $this;
    }

    public function removePermission(Permission $permission): static
    {
        if ($this->permissions->contains($permission)) {
            $this->permissions->removeElement($permission);
        }

        return $this;
    }

    public function removeAllPermissions(): static
    {
        foreach ($this->permissions as $permission) {
            $this->permissions->removeElement($permission);
        }

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getMiddlename(): ?string
    {
        return $this->middlename;
    }

    public function setMiddlename(?string $middlename): static
    {
        $this->middlename = $middlename;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image && $this->imageOriginalFilename
            ? (new S3Client($this->bucket))->getLink($this->image, $this->imageOriginalFilename, false)
            : null;
    }

    public function setImage(?UploadedFile $image): static
    {
        if (is_null($image)) {
            $this->bucket = null;
            $this->image = null;
            $this->imageOriginalFilename = null;
        } else {
            $s3 = new S3Client();
            $this->bucket = $s3->getBucket();
            $this->image = $s3->uploadImage($image, 'user-image');
            $this->imageOriginalFilename = $image->getClientOriginalName();
        }

        return $this;
    }

    public function getContactInformation(): ?array
    {
        return $this->contactInformation;
    }

    public function setContactInformation(?array $contactInformation): static
    {
        $this->contactInformation = $contactInformation;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getLoginAttempts(): ?int
    {
        return $this->loginAttempts;
    }

    public function setLoginAttempts(int $loginAttempts): static
    {
        $this->loginAttempts = $loginAttempts;

        return $this;
    }

    public function isDisabled(): ?bool
    {
        return $this->isDisabled;
    }

    public function setDisabled(bool $isDisabled): static
    {
        $this->isDisabled = $isDisabled;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    #[\Override]
    public function __toString(): string
    {
        return $this->getFullName() ?? '';
    }

    public function getFullName(): ?string
    {
        if (!$this->getFirstName() || !$this->getLastName()) {
            return null;
        }

        $fullName = $this->getFirstName() . ' ' . $this->getLastName();

        if ($this->getMiddleName()) {
            $fullName .= ' ' . $this->getMiddleName();
        }

        return $fullName;
    }

    public function normalizeName(): static
    {
        if ($this->getFirstName()) {
            $this->setFirstName(Utils::ucwords(Utils::uclower($this->getFirstName())));
        }

        if ($this->getLastName()) {
            $this->setLastName(Utils::ucwords(Utils::uclower($this->getLastName())));
        }

        if ($this->getMiddleName()) {
            $this->setMiddleName(Utils::ucwords(Utils::uclower($this->getMiddleName())));
        }

        return $this;
    }

    public function computeSlug(SluggerInterface $slugger): static
    {
        $this->slug = (string)$slugger->slug(sprintf('%s %s', $this->id, $this->getFullName()))->lower();

        return $this;
    }

    #[\Override]
    public function toArray(bool $deep = false): array
    {
        $result = [
            'id' => $this->getId(),
            'email' => $this->getEmail(),
            'firstname' => $this->getFirstname(),
            'lastname' => $this->getLastname(),
            'middlename' => $this->getMiddlename(),
            'contact_information' => $this->getContactInformation(),
            'image' => $this->getImage(),
            'slug' => $this->getSlug(),
            'is_active' => $this->isActive(),
            'login_attempts' => $this->getLoginAttempts(),
            'is_disabled' => $this->isDisabled(),
        ];

        if ($deep) {
            $result['permissions'] = [];

            if (!empty($this->getPermissions())) {
                /** @var Permission $permission */
                foreach ($this->getPermissions() as $permission) {
                    $result['permissions'][$permission->getId()] = $permission->toArray();
                }
            }
        }

        return $result;
    }
}
