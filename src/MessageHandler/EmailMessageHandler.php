<?php

namespace App\MessageHandler;

use App\Message\EmailMessage;
use App\Repository\EmailRepository;
use App\Utils\Utils;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

#[AsMessageHandler]
class EmailMessageHandler
{
    public function __construct(
        private readonly EmailRepository $emailRepository,
        private readonly MailerInterface $mailer,
        private readonly string $publicDir,
    ) {
    }

    public function __invoke(EmailMessage $message)
    {
        $email = $this->emailRepository->findOneBy(['id' => $message->getId()]);

        if (null === $email) {
            return;
        }

        $emailObject = (new Email())
            ->from(new Address($email->getFromEmail(), $email->getFromName()))
            ->to($email->getToEmail())
            ->subject($email->getSubject())
            ->html($this->replaceImages($email->getBody()));

        if ($email->getCc()) {
            $emailObject->cc(...$email->getCc());
        }

        if ($email->getBcc()) {
            $emailObject->bcc(...$email->getBcc());
        }

        if ($email->getReplyTo()) {
            $emailObject->replyTo($email->getReplyTo());
        }

        $this->mailer->send($emailObject);
    }

    private function replaceImages(string $content): string
    {
        $pattern = '/<img\s+([^>]*?)\bsrc=([\'\"])(.*?)\2([^>]*)>/i';

        return preg_replace_callback($pattern, function ($matches) {
            $base64 = $this->getBase64image($matches[3]);

            if (null === $base64) {
                return $matches[0];
            }

            // Recreate the img tag with the modified src value
            return '<img ' . $matches[1] . 'src=' . $matches[2] . $base64 . $matches[2] . $matches[4] . '>';
        }, $content);
    }

    private function getBase64image(string $path): ?string
    {
        if (!file_exists($this->publicDir . $path)) {
            return null;
        }

        $contentType = Utils::extensionToContentType(pathinfo($path, PATHINFO_EXTENSION) ?? '');
        $result = sprintf('data:%s;base64,', $contentType);

        return $result . base64_encode(file_get_contents($this->publicDir . $path));
    }
}
