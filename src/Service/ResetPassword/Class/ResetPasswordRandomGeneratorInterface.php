<?php

namespace App\Service\ResetPassword\Class;

interface ResetPasswordRandomGeneratorInterface
{
    public function generate(int $length): string;
}
