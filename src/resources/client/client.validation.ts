import z, { object, string, number } from "zod";

export const createClientSchema = object({
    name: string().min(3).max(255),
    username: string().min(3).max(255),
    password: string().min(6).max(255),
    publicIps: string().min(7).max(15).array(),
    workerName: string().min(3).max(255),
    workerPassword: string().min(3).max(255),  
});

export type CreateClientSchema = z.infer<typeof createClientSchema>;