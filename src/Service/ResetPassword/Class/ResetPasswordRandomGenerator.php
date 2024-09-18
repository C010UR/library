<?php

namespace App\Service\ResetPassword\Class;

class ResetPasswordRandomGenerator implements ResetPasswordRandomGeneratorInterface
{
    #[\Override]
    public function generate(int $length): string
    {
        $result = '';

        while (($len = strlen($result)) < 20) {
            $size = 20 - $len;
            $bytes = random_bytes($size);

            $result .= substr(
                str_replace(['/', '+', '='], '', base64_encode($bytes)),
                0,
                $size,
            );
        }

        return $result;
    }
}
