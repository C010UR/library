<?php

namespace App\Utils;

class Environment
{
    public static function getEnvironment(): string
    {
        return $_ENV['APP_ENV'] ?? 'production';
    }

    public static function isDev(): bool
    {
        return 'dev' === self::getEnvironment();
    }

    public static function isStage(): bool
    {
        return in_array(self::getEnvironment(), ['dev', 'stage']);
    }

    public static function isProd(): bool
    {
        return !in_array(self::getEnvironment(), ['dev', 'stage']);
    }
}
