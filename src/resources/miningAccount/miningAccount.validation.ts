import { Coins } from "@prisma/client";
import { add } from "lodash";
import z, { object, string, number, nativeEnum } from "zod";

const walletSchema = object({
    address: string().min(1).max(255),
    coin: nativeEnum(Coins),
});

export const createMiningAccountSchema = object({
	note: string().min(1).max(255),
	code: string().min(1).max(255),
	coin: nativeEnum(Coins),
	hashrateLimitPh: number().min(0),
    hashratePerMachineTh: number().min(0),
    multiplicationFactor: number().min(0),
	clientId: string().min(1).max(255),
	workerName: string().min(1).max(255),
	poolId: string().min(1).max(255),
	proxyId: string().min(1).max(255),
    wallets: walletSchema.array().optional(),
    inDiff: number().min(0),
});

export type CreateMiningAccountSchema = z.infer<typeof createMiningAccountSchema>;

export const updateMiningAccountSchema = object({
    note: string().min(1).max(255),
    code: string().min(1).max(255),
    coin: nativeEnum(Coins),
    hashrateLimitPh: number().min(0),
    hashratePerMachineTh: number().min(0),
    multiplicationFactor: number().min(0),
    clientId: string().min(1).max(255),
    workerName: string().min(1).max(255),
    poolId: string().min(1).max(255),
    proxyId: string().min(1).max(255),
    wallets: walletSchema.array().optional(),
    inDiff: number().min(0),
});

export type UpdateMiningAccountSchema = z.infer<typeof updateMiningAccountSchema>;

