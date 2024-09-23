import z from 'zod';

const AuthScheme = z.object({
  password: z.string()
    .min(8, { message: 'La contraseña debe ser de al menos 8 caracteres'})
    .max(64, { message: 'La contraseña debe ser maximo de 64 caracteres'})
    .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una minuscula'})
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayuscula'})
    .regex(/\d/,{ message: 'La contraseña debe contener al menos un numero'})
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'La contraseña debe contener al menos un caracter especial'})
    .refine((value) => !/\s/.test(value), { message: 'La contraseña no puede contener espacios'}) 
});

export function validatePassword (password) {
  return AuthScheme.safeParse({password});
};