<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class UserUpdateSelfType extends AbstractType
{
    #[\Override]
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname', TextType::class, [
                'required' => true,
                'trim' => true,
                'constraints' => [
                    new Assert\NotBlank(message: 'First name cannot be empty'),
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'First name is too short. First name must contain at least {{ limit }} characters',
                        maxMessage: 'First name is too long. First name must not exceed {{ limit }} characters',
                    ),
                ],
            ])
            ->add('lastname', TextType::class, [
                'required' => true,
                'trim' => true,
                'constraints' => [
                    new Assert\NotBlank(message: 'Last Name cannot be empty.'),
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'Last name is too short. First name must contain at least {{ limit }} characters',
                        maxMessage: 'Last name is too long. First name must not exceed {{ limit }} characters',
                    ),
                ],
            ])
            ->add('middlename', TextType::class, [
                'required' => false,
                'trim' => true,
                'constraints' => [
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'Middle name is too short. First name must contain at least {{ limit }} characters',
                        maxMessage: 'Middle name is too long. First name must not exceed {{ limit }} characters',
                    ),
                ],
            ])
            ->add('image', FileType::class, [
                'required' => false,
                'constraints' => [
                    new Assert\Image(
                        maxSize: '8192k',
                        maxSizeMessage: 'The image is too large. The maximum size of the image is {{ limit }}',
                    ),
                ],
            ]);
    }

    #[\Override]
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'csrf_protection' => false,
        ]);
    }
}
