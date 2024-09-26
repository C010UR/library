<?php

namespace App\Service\ResetPassword\Class;

use App\Utils\Utils;

class ResetPasswordRandomGenerator implements ResetPasswordRandomGeneratorInterface
{
    #[\Override]
    public function generate(int $length): string
    {
        return Utils::generateRandomString($length);
    }
}
