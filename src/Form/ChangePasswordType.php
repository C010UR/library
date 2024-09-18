<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class ChangePasswordType extends AbstractType
{
    #[\Override]
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('password', PasswordType::class, [
            'required' => true,
            'invalid_message' => 'Password is not valid.',
            'constraints' => [
                new Assert\NotBlank([
                    'message' => 'Password is not specified',
                ]),
                new Assert\Length([
                    'min' => 8,
                    'minMessage' => 'The password is too short. Password must contain at least {{ limit }} characters',
                    // max length allowed by Symfony for security reasons
                    'max' => 4096,
                ]),
                new Assert\PasswordStrength([
                    'minScore' => Assert\PasswordStrength::STRENGTH_MEDIUM,
                    'message' => 'The password strength is too low. Please use a stronger password',
                ]),
            ],
        ]);
    }

    #[\Override]
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
        ]);
    }
}
