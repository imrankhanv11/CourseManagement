import z from 'zod'

export const addCourseSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Atleast 3 Letter Required" }),

    DurationInMonths: z.number().nonnegative("Duration can't be Negative")
        .int("Can't be Letters")
        .refine((data) => data <= 24, "Can't be More than 24 Months")
        .refine((data) => data != 0, "Atleast One month duration required"),

    StartDate: z.string().refine((data) => new Date(data) > new Date(), "Can't be in Past Days"),

    MinimumRequiredAge: z.number().nonnegative("Duration can't be Negative").
        int("Can't be Letters").refine((data) => data >= 5, "Can't be in less then 5"),

});

export type addCourseData = z.infer<typeof addCourseSchema>;