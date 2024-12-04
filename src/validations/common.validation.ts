import z, { object, string } from "zod";


export const idSchema = object({
    id: string().min(3).max(255),
});

export type IdInput = z.infer<typeof idSchema>;