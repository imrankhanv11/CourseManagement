import z from 'zod'

export const registerFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Atleast 3 Letter Required" }),

    email: z.email({ message: "Email is Invalid" }),

    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Weak password"
    ),

});

export type RegisterFormData = z.infer<typeof registerFormSchema>;