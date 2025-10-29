import z from 'zod'

export const loginFormSchema = z.object({

    email: z.email({ message: "Email is Invalid" }),

    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Weak password"
    ),

});

export type LognFormData = z.infer<typeof loginFormSchema>;