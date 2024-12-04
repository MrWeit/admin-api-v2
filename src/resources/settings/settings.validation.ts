// src/validations/settings.validation.ts
import { z, TypeOf, array, object, string, number } from "zod";

const poolSchema = z.object({
	name: z.string().min(1, "Pool name is required"),
	port: z.number().int().nonnegative("Port must be a non-negative integer"),
	domain: z.string().min(1, "Domain is required"),
	id: z.string().min(1, "Pool id is required").optional(),
});

const vpsSchema = z.object({
	name: z.string().min(1, "VPS name is required"),
	ip: z
		.string()
		.min(1, "IP is required")
		.regex(
			/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
			"Invalid IP address"
		),
	id: z.string().min(1, "VPS id is required").optional(),
});

export const createUpdateSettingsSchema = z.object({
	pools: z.array(poolSchema).nonempty("At least one pool is required"),
	VPSs: z.array(vpsSchema).nonempty("At least one VPS is required"),
	defaultMaxPhPerMiningAccountBtc: z
		.number()
		.positive("Must be a positive number"),
	hashrateMultiplicationFactorBtc: z
		.number()
		.min(0, "Must be greater than or equal to 0"),
	hashrateMultiplicationFactorLtc: z
		.number()
		.min(0, "Must be greater than or equal to 0"),
	defaultMaxPhPerMiningAccountLtc: z
		.number()
		.positive("Must be a positive number"),
	defaultInitialDifficultyBtc: z
		.number()
		.positive("Must be a positive number"),
	defaultInitialDifficultyLtc: z
		.number()
		.positive("Must be a positive number"),
	dockerPortRangeStart: z
		.number()
		.int()
		.nonnegative("Port must be a non-negative integer"),
	dockerPortRangeEnd: z
		.number()
		.int()
		.nonnegative("Port must be a non-negative integer"),
	dockerCliTcpPort: z
		.number()
		.int()
		.nonnegative("Port must be a non-negative integer"),
});

export type CreateUpdateSettingsSchema = TypeOf<
	typeof createUpdateSettingsSchema
>;

export const proxySchema = object({
	entryPoint: string().min(1).max(255),
	ip: string().min(1).max(255),
	port: number().min(0),
	countryCode: string().min(1).max(255),
});


export const postAllProxiesSchema = array(proxySchema).nonempty();

export type PostAllProxiesSchema = TypeOf<typeof postAllProxiesSchema>;
