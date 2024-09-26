<?php

namespace App\Twig;

use App\Utils\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class EnvExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('get_env_variable', $this->getEnvVariable(...)),
            new TwigFunction('is_dev', $this->isDev(...)),
            new TwigFunction('is_stage', $this->isStage(...)),
            new TwigFunction('is_prod', $this->isProd(...)),
        ];
    }

    public function getEnvVariable(string $key): ?string
    {
        return $_ENV[$key] ?? null;
    }

    public function isDev(): bool
    {
        return Environment::isDev();
    }

    public function isStage(): bool
    {
        return Environment::isStage();
    }

    public function isProd(): bool
    {
        return Environment::isProd();
    }
}
