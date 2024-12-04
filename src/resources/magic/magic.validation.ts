import { Coins } from "@prisma/client";
import z, { nativeEnum, object, string } from "zod";

export const authenticateMinerSchema = object({
    worker_name: string().min(1).max(50),
    worker_password: string().min(1).max(50),
    public_ip: string().min(1).max(50).optional(),
    coin: nativeEnum(Coins),
    instance_id: string().min(1).max(50),
});

export type AuthenticateMinerSchema = z.infer<typeof authenticateMinerSchema>;
