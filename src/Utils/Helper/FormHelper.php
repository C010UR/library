<?php

namespace App\Utils\Helper;

use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class FormHelper
{
    public static function submit(
        Request $request,
        FormInterface $form,
        bool $clearMissing = false,
    ): FormInterface {
        $contentType = strtolower((string) $request->headers->get('content-type'));

        $handles = self::getHandles();

        if (!array_key_exists($contentType, $handles)) {
            throw new BadRequestException(sprintf("Content-Type '%s' is not supported.", $request->headers->get('content-type')));
        }

        $form->submit($handles[$contentType]($request), $clearMissing);

        if (!$form->isValid()) {
            $errors = array_map(
                fn (FormError $error) => $error->getMessage(),
                iterator_to_array($form->getErrors(true)),
            );

            throw new BadRequestException(implode('<br />', $errors));
        }

        return $form;
    }

    private static function getHandles(): array
    {
        return [
            'application/json' => self::handleJson(...),
            'multipart/form-data' => self::handleFormData(...),
            'application/x-www-form-urlencoded' => self::handleFormData(...),
        ];
    }

    private static function handleJson(Request $request): array
    {
        try {
            return json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\Throwable $throwable) {
            throw new NotEncodableValueException('Json is invalid.', previous: $throwable);
        }
    }

    private static function handleFormData(Request $request): array
    {
        return array_merge_recursive($request->request->all(), $request->files->all());
    }
}
