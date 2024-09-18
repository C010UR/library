<?php

namespace App\Entity\Interface;

interface ArrayTransformableInterface
{
    public function toArray(bool $deep = false): array;
}
