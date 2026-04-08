import { z } from 'zod';

export const RegisterSchema = z.object({

    email: z.email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name is too short"),
    phone: z.string().min(10, "Invalid phone number"),
    address: z.string(),
    city: z.string(),
    country: z.string()
})

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string()
})


export const ForgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export const ResetPasswordSchema = z.object({
    password: z.string().min(8, "New password must be at least 8 characters long"),
});