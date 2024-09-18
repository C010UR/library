<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordRequestType extends AbstractType
{
    #[\Override]
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'required' => true,
                'trim' => true,
                'invalid_message' => 'Email is not valid',
                'constraints' => [
                    new Assert\NotBlank(message: 'Email cannot be empty'),
                ],
            ])
            ->add('hook', UrlType::class, [
                'required' => true,
                'invalid_message' => 'Hook URL is not valid',
                'empty_data' => null,
                'trim' => true,
                'constraints' => [
                    new Assert\NotBlank(message: 'Hook URL cannot be empty'),
                    new Assert\Url([
                        'message' => 'Hook URL is not valid',
                    ]),
                ],
            ]);
    }

    #[\Override]
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
        ]);
    }
}
