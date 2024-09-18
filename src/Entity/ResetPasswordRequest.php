<?php

namespace App\Entity;

use App\Repository\ResetPasswordRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ResetPasswordRequestRepository::class)]
class ResetPasswordRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeInterface $requestedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $_user;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeInterface $expiresAt;

    #[ORM\Column(length: 20)]
    private ?string $selector;

    #[ORM\Column(length: 100)]
    private ?string $hashedToken;

    public function __construct(
        User $_user,
        \DateTimeInterface $expiresAt,
        string $selector,
        string $hashedToken,
    ) {
        $this->_user = $_user;
        $this->expiresAt = $expiresAt;
        $this->requestedAt = new \DateTimeImmutable('now');
        $this->selector = $selector;
        $this->hashedToken = $hashedToken;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRequestedAt(): \DateTimeInterface
    {
        return $this->requestedAt;
    }

    public function isExpired(): bool
    {
        return $this->expiresAt->getTimestamp() < time();
    }

    public function getExpiresAt(): \DateTimeInterface
    {
        return $this->expiresAt;
    }

    public function getHashedToken(): string
    {
        return $this->hashedToken;
    }

    public function getUser(): ?User
    {
        return $this->_user;
    }

    public function setUser(?User $_user): static
    {
        $this->_user = $_user;

        return $this;
    }

    public function getSelector(): string
    {
        return $this->selector;
    }
}
