<?php

namespace App\Utils;

class Validator
{
    public static function notBlank(mixed $value): string
    {
        if (empty($value)) {
            throw new \InvalidArgumentException('Field must not be empty');
        }

        return (string)$value;
    }

    public static function nullOrNotEmpty(mixed $value): mixed
    {
        return empty($value) ? null : $value;
    }

    public static function email(mixed $value): mixed
    {
        self::notBlank($value);

        if (false === filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email is not valid');
        }

        return $value;
    }

    public static function nullOrFilePath(mixed $value): mixed
    {
        if (empty($value)) {
            return null;
        }

        $projectDir = dirname(__DIR__, 2);

        if (!file_exists($projectDir . '/' . trim($value, '\\/'))) {
            throw new \InvalidArgumentException('File not found');
        }

        return $value;
    }
}
