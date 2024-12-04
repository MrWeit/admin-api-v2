import { Prisma } from "@prisma/client";
import { prisma } from "@utils/prismaClient";
import { CreateUpdateSettingsSchema } from "./settings.validation";
import { omit } from "lodash";
import { pingServer } from "@utils/functions";

class SettingsService {
	public async getVPSs() {
		return prisma.vPS.findMany();
	}

	public async getPools() {
		return prisma.pool.findMany();
	}

	public async createVPS(input: Prisma.VPSCreateInput) {
		return prisma.vPS.create({ data: input });
	}

	public async createPool(input: Prisma.PoolCreateInput) {
		return prisma.pool.create({ data: input });
	}

	public async updateVPS(where: Prisma.VPSWhereUniqueInput, input: Prisma.VPSUpdateInput) {
		return prisma.vPS.update({ where, data: input });
	}

	public async updatePool(where: Prisma.PoolWhereUniqueInput, input: Prisma.PoolUpdateInput) {
		return prisma.pool.update({ where, data: input });
	}

	public async getSettingsWithStatus() {
		const settings = await prisma.settings.findFirst({ include: { pools: true, VPSs: true } });
		if (!settings) {
			return [];
		}
		const newVPSs = settings.VPSs.map(async (vps) => {
			return {
				...vps,
				status: await pingServer(vps.ip) ? "online" : "offline",
			}
		});

		return {
			...settings,
			VPSs: await Promise.all(newVPSs),
		}
	}

	public async getSettings() {
		return prisma.settings.findFirst({ include: { pools: true, VPSs: true } });
	}

	public async createSettings(input: Prisma.SettingsCreateInput) {
		return prisma.settings.create({ data: input, });
	}

	public async updateSettings(
		where: Prisma.SettingsWhereUniqueInput,
		input: Prisma.SettingsUpdateInput
	) {
		return prisma.settings.update({ where, data: input });
	}

	public async createUpdateSettings(input: CreateUpdateSettingsSchema) {
		try {
			//Will check if settings already exists
			//If exists, will update settings
			//If not, will create settings
			const settings = await this.getSettings();
			if (!settings) {
				const { pools, VPSs, ...settingsData } = input;
				await this.createSettings({
					...settingsData,
					pools: {
						create: input.pools,
					},
					VPSs: {
						create: input.VPSs,
					},
				});
			} else {
				const { pools, VPSs, ...settingsData } = input;

				await this.updateSettings({ id: settings.id }, {
					...settingsData,
					pools: {
						deleteMany: settings.pools.filter((pool) => !pools.find((newPool) => newPool.id === pool.id)).map((pool) => ({ id: pool.id })),
						create: pools.filter((pool) => !pool.id),
						update: pools.map((pool) => {
							if(pool.id) {
								return {
									where: { id: pool.id },
									data: omit(pool, ['id']),
								}
							}
							return undefined;
						}
						).filter((pool) => pool !== undefined),
					},
					VPSs: {
						deleteMany: settings.VPSs.filter((vps) => !VPSs.find((newVPS) => newVPS.id === vps.id)).map((vps) => ({ id: vps.id })),
						create: VPSs.filter((vps) => !vps.id),
						update: VPSs.map((vps) => {
							if(vps.id) {
								return {
									where: { id: vps.id },
									data: omit(vps, ['id']),
								}
							}
							return undefined;
						}).filter((vps) => vps !== undefined),
					},
				});
			}
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async postJsonProxiesList(data: Prisma.ProxyCreateManyInput[]) {
		return prisma.proxy.createMany({
			data
		});
	}

	public async getProxies() {
		return prisma.proxy.findMany({
			include: {
				miningAccounts: true
			}
		});
	}
}

export default SettingsService;
