import { z } from 'zod';

import { formErrorMessages } from '@/types/messages';

export const passwordSchema = (min: number = 8, max: number = 255) =>
  stringSchema(min, max)
    .refine((password) => /[A-Z]/.test(password), {
      message: formErrorMessages.password.uppercase,
    })
    .refine((password) => /[a-z]/.test(password), {
      message: formErrorMessages.password.lowercase,
    })
    .refine((password) => /[0-9]/.test(password), {
      message: formErrorMessages.password.number,
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: formErrorMessages.password.special,
    });

export const stringSchema = (min: number = 8, max: number = 255) =>
  z
    .string()
    .min(min, {
      message: formErrorMessages.minLength
        .replace('{minLength}', String(min))
        .replace('{field}', 'Password'),
    })
    .max(max, {
      message: formErrorMessages.maxLength
        .replace('{maxLength}', String(max))
        .replace('{field}', 'Password'),
    });

export const emailSchema = () =>
  z
    .string()
    .email(formErrorMessages.email);

export const booleanSchema = () =>
    z
        .boolean();
