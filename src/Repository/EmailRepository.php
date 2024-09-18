<?php

namespace App\Repository;

use App\Entity\Email;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Mime\Address;

/**
 * @extends ServiceEntityRepository<Email>
 */
class EmailRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Email::class);
    }

    public function createEmail(
        Address $address,
        string $to,
        string $subject,
        string $body,
    ): Email {
        $email = new Email();

        $email
            ->setFromEmail($address->getAddress())
            ->setFromName($address->getName())
            ->setToEmail($to)
            ->setSubject($subject)
            ->setBody($body);

        return $email;
    }

    public function persistEmail(Email $email): void
    {
        $this->getEntityManager()->persist($email);
        $this->getEntityManager()->flush();
    }
}
