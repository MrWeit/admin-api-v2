import z, { object, string, number } from "zod";

export const createDockerSchema = object({
    name: string().min(3).max(255),
    vpsId: string().min(3).max(255),
    port: number().min(1).max(65535),
});

export type CreateDockerSchema = z.infer<typeof createDockerSchema>;