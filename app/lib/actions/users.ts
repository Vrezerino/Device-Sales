'use server';

import { signIn } from '@/app/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const UserFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string()
});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
};