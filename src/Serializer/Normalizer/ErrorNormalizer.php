<?php

namespace App\Serializer\Normalizer;

use App\Utils\Environment;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Symfony\Component\ErrorHandler\Exception\FlattenException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ErrorNormalizer implements NormalizerInterface
{
    public function normalize(
        mixed $object,
        ?string $format = null,
        array $context = [],
    ): array|string|int|float|bool|\ArrayObject|null {
        /** @var $object FlattenException */
        $result = [
            'error' => true,
            'code' => $object->getStatusCode(),
            'message' => $this->getMessage($object),
        ];

        if (Environment::isDev()) {
            $result['stack_trace'] = $object->toArray();
        }

        return $result;
    }

    private function getMessage(FlattenException $object): string
    {
        return match ($object->getClass()) {
            ForeignKeyConstraintViolationException::class => 'This object is used and cannot be deleted',
            NotEncodableValueException::class, NotNormalizableValueException::class => 'JSON is invalid',
            NotFoundHttpException::class => 'Resource not found',
            default => $object->getMessage(),
        };
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof FlattenException;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            FlattenException::class => __CLASS__ === self::class,
        ];
    }
}
