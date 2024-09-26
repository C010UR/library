<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class EntryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('key', TextType::class, [
                'required' => true,
                'trim' => true,
                'constraints' => [
                    new Assert\NotBlank(message: 'First name cannot be empty'),
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'Key is too short. Key must contain at least {{ limit }} characters',
                        maxMessage: 'Key is too long. Key must not exceed {{ limit }} characters',
                    ),
                ],
            ])
            ->add('value', TextType::class, [
                'required' => true,
                'trim' => true,
                'constraints' => [
                    new Assert\NotBlank(message: 'First name cannot be empty'),
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'Value is too short. Value must contain at least {{ limit }} characters',
                        maxMessage: 'Value is too long. Value must not exceed {{ limit }} characters',
                    ),
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
        ]);
    }
}
