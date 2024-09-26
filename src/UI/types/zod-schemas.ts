import { z } from 'zod';

import { formErrorMessages } from '@/types/messages';

export const passwordSchema = (min: number = 8, max: number = 255) =>
  stringSchema({ min, max, fieldName: 'Password' })
    .refine((password) => /[A-Z]/.test(password), {
      message: formErrorMessages.password.uppercase,
    })
    .refine((password) => /[a-z]/.test(password), {
      message: formErrorMessages.password.lowercase,
    })
    .refine((password) => /[0-9]/.test(password), {
      message: formErrorMessages.password.number,
    })
    .refine((password) => /[!@#$%^&*\[\]:()\-=_+{}?><,./\\|]/.test(password), {
      message: formErrorMessages.password.special,
    });

export const stringSchema = ({
  min = 8,
  max = 255,
  fieldName = 'Field',
}: {
  min?: number;
  max?: number;
  fieldName?: string;
} = {}) =>
z
    .string()
    .min(min, {
      message: formErrorMessages.minLength
        .replace('{minLength}', String(min))
        .replace('{field}', fieldName),
    })
    .max(max, {
      message: formErrorMessages.maxLength
        .replace('{maxLength}', String(max))
        .replace('{field}', fieldName),
    });

export const emailSchema = () => z.string().email(formErrorMessages.email);

export const booleanSchema = () => z.boolean();

export const fileSchema = () =>
  z
    .any()
    .refine(
      (file) => typeof file === 'string' || file.size <= 8 * 1024 * 1024,
      formErrorMessages.maxFileSize.replace('{fileSize}', '8MB'),
    );
