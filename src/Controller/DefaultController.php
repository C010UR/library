<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route(
        '/{spaRouting}',
        name: 'index',
        requirements: ['spaRouting' => '^(?!uploads/).*'],
        defaults: ['spaRouting' => null],
        methods: ['GET'],
        priority: -2
    )]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }
}
