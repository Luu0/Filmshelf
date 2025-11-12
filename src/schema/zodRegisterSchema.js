import { z } from "zod";

export const registerSchema = z.object({
    email: z
        .string()
        .email("Invalid email format"),

    username: z
        .string()
        .min(3, "Username must have at least 3 characters"),

    password: z
        .string()
        .min(8, "Password must have at least 8 characters"),

    confirmPassword: z
        .string()
    })
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
