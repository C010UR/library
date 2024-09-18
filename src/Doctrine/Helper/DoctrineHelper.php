<?php

namespace App\Doctrine\Helper;

class DoctrineHelper
{
    public static function transformToTsQuery(string $input): string
    {
        return implode('&', array_map(fn($val) => trim($val) . ':*', array_filter(explode(' ', $input), fn($val) => !empty(trim($val)))));
    }

    public static function transformToLikeExpression(string $input): string
    {
        return sprintf('%%%s%%', strtolower($input));
    }
}
