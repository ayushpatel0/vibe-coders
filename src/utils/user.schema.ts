import { z } from "zod";


export const userRegisterSchema = z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export const userLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});