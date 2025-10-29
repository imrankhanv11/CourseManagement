import z from 'zod'

export const addUserShema = z.object({
    name: z
        .string()
        .min(3, { message: "Atleast 3 Letter Required" }),

    email: z.email("Invalid Type"),

    dateOfBirth: z.string().refine((data) => new Date(data) < new Date(), "Can't be in Future Days"),

    phoneNumber: z.string()
        .min(10, "Mobile number must be 10 digits")
        .max(10, "Mobile number must be 10 digits")
        .regex(/^\d+$/, "Mobile number can contain only digits"),

    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Weak password"
    ),

    isActive: z.boolean(),

    isAdmin: z.string()
});

export type addUserData = z.infer<typeof addUserShema>;