<?php

namespace App\Form;

use App\Entity\Permission;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class PermissionType extends AbstractType
{
    #[\Override]
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'required' => true,
                'trim' => true,
                'constraints' => [
                    new Assert\NotBlank(message: 'Name cannot be empty'),
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'Name is too short. First name must contain at least {{ limit }} characters',
                        maxMessage: 'Name is too long. First name must not exceed {{ limit }} characters',
                    ),
                ],
            ])
            ->add('description', TextType::class, [
                'required' => false,
                'trim' => true,
                'constraints' => [
                    new Assert\Length(
                        min: 3,
                        max: 16384,
                        minMessage: 'Description is too short. First name must contain at least {{ limit }} characters',
                        maxMessage: 'Description is too long. First name must not exceed {{ limit }} characters',
                    ),
                ],
            ]);
    }

    #[\Override]
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Permission::class,
            'csrf_protection' => false,
        ]);
    }
}
