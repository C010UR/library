<?php

namespace App\Utils\Helper;

trait ServiceHelper
{
    private function processOneOrMany(
        mixed $value,
        callable $process,
        ?callable $pre = null,
        ?callable $post = null,
        ...$values,
    ): mixed {
        if (!is_null($pre)) {
            if (is_array($value) || is_iterable($value)) {
                foreach ($value as $_value) {
                    $pre($_value, ...$values);
                }
            } else {
                $pre($value, ...$values);
            }
        }

        $value = $process($value, ...$values);

        if (!is_null($post)) {
            if (is_array($value) || is_iterable($value)) {
                foreach ($value as $_value) {
                    $post($_value, ...$values);
                }
            } else {
                $post($value, ...$values);
            }
        }

        return $value;
    }
}
