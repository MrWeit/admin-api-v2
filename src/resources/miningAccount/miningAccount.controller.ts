// src/controllers/docker.controller.ts

import Controller from "@interfaces/controller.interface";
import { Router, RequestHandler } from "express";
import { validateRequest } from "@middleware/validation.middleware";
import { showSuccess } from "@utils/helper";
import { BadRequestError } from "@utils/http.exceptions";
import authenticatedMiddleware, {
	AuthenticatedRequest,
} from "@middleware/auth.middleware";
import LoggerService from "@resources/logger/logger.service";
import MiningAccountService from "./miningAccount.service";
import {
	createMiningAccountSchema,
	CreateMiningAccountSchema,
} from "./miningAccount.validation";
import { Coins } from "@prisma/client";

class MiningAccountController implements Controller {
	public path = "/admin/mining-account";
	public router = Router();
	private miningAccountService = new MiningAccountService();
	private log = new LoggerService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		// Create mining account
		this.router.post(
			`${this.path}/create`,
			authenticatedMiddleware,
			validateRequest(createMiningAccountSchema),
			this.createMiningAccount
		);

		// List all mining accounts
		this.router.get(
			`${this.path}/list`,
			authenticatedMiddleware,
			this.listMiningAccounts
		);

		// Delete mining account
		this.router.delete(
			`${this.path}/delete/:id`,
			authenticatedMiddleware,
			this.deleteMiningAccount
		);

        this.router.get(
            `${this.path}/get/:id`,
            authenticatedMiddleware,
            this.getMiningAccount
        )

		this.router.post(
			`${this.path}/create-multiple`,
			authenticatedMiddleware,
			this.createMultipleMiningAccounts
		);
	}

	private createMiningAccount: RequestHandler = async (
		req: AuthenticatedRequest<CreateMiningAccountSchema>,
		res,
		next
	): Promise<void> => {
		try {
			//Will create the mining account
			const { poolId, clientId, proxyId, ...rest } = req.body;
			const miningAccount = await this.miningAccountService.createMiningAccount(
				{
					...rest,
					pool: {
						connect: {
							id: poolId,
						},
					},
					client: {
						connect: {
							id: clientId,
						},
					},
                    proxy: {
                        connect: {
                            id: proxyId,
                        }
                    }
				}
			);

			showSuccess(req, res, "Mining Account Created", {
				data: miningAccount,
			});
		} catch (error: any) {
			await this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error creating Mining Account"));
		}
	};

	private listMiningAccounts: RequestHandler = async (
		req: AuthenticatedRequest,
		res,
		next
	): Promise<void> => {
		try {
			const miningAccounts =
				await this.miningAccountService.getMiningAccounts();
			showSuccess(req, res, "Mining Accounts listed successfully", {
				data: miningAccounts,
			});
		} catch (error: any) {
			await this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error listing mining accounts"));
		}
	};

	private deleteMiningAccount: RequestHandler = async (
		req: AuthenticatedRequest<any, { id?: string }>,
		res,
		next
	): Promise<void> => {
		try {
			if (!req.params.id) {
				throw new Error("Mining Account ID is required");
			}

			const minerAccount = await this.miningAccountService.deleteMiningAccount(
				req.params.id
			);

			//Deletes from db
			showSuccess(req, res, "Mining account Deleted", {
				data: minerAccount,
			});
		} catch (error: any) {
			this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error deleting mining account container"));
		}
	};

    private getMiningAccount: RequestHandler = async (
        req: AuthenticatedRequest<any, {id?: string}>,
        res,
        next
    ): Promise<void> => {
        try {
            if (!req.params.id) {
                throw new Error("Mining Account ID is required");
            }

            const miningAccount = await this.miningAccountService.getMiningAccountById(
                req.params.id
            );

            showSuccess(req, res, "Mining Account", {
                data: miningAccount,
            });
        } catch (error: any) {
            this.log.createLog(
                "ERROR",
                error.message,
                JSON.stringify({ ip: req.ip, url: req.originalUrl })
            );
            next(new BadRequestError("Error getting mining account"));
        }
    };

	private createMultipleMiningAccounts: RequestHandler = async (
		req: AuthenticatedRequest<{ workerNames: string[] }>,
		res,
		next
	): Promise<void> => {
		try {
			const { workerNames } = req.body;
	
			// Constants for Mining Account Parameters
			const POOL_ID = "6740ce5f147e213c2a4b3157";
			const CLIENT_ID = "674936a9a138316ce046b6ee";
			const COIN: Coins = "BTC"; // or "LTC"
			const NOTE = "Nebolaloop1";
			const CODE_PREFIX = "sha"; // Code prefix for unique code generation
			const HASHRATE_LIMIT_PH = 4;
			const HASHRATE_PER_MACHINE_TH = 120;
			const MULTIPLICATION_FACTOR = 3;
			const IN_DIFF = 1048576;
	
			// Get available proxies
			const proxies = await this.miningAccountService.getProxies();
	
			if (proxies.length === 0) {
				throw new Error("No proxies available");
			}
	
			// Distribute workerNames across proxies evenly
			const proxyAssignments = workerNames.map((workerName, index) => {
				const proxy = proxies[index % proxies.length];
				return { workerName, proxyId: proxy.id };
			});
	
			// Prepare Mining Accounts Data
			const miningAccountsData = proxyAssignments.map(({ workerName, proxyId }, index) => ({
				note: NOTE,
				code: `${CODE_PREFIX}-${Date.now()}-${index}`,
				coin: COIN,
				hashrateLimitPh: HASHRATE_LIMIT_PH,
				hashratePerMachineTh: HASHRATE_PER_MACHINE_TH,
				multiplicationFactor: MULTIPLICATION_FACTOR,
				inDiff: IN_DIFF,
				wallets: [],
				workerName,
				pool: {
					connect: {
						id: POOL_ID,
					},
				},
				client: {
					connect: {
						id: CLIENT_ID,
					},
				},
				proxy: {
					connect: {
						id: proxyId,
					},
				},
			}));
	
			// Create Mining Accounts in Bulk
			const createdMiningAccounts = await this.miningAccountService.createMultipleMiningAccounts(
				miningAccountsData
			);
	
			showSuccess(req, res, "Mining Accounts Created", {
				data: createdMiningAccounts,
			});
		} catch (error: any) {
			await this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error creating multiple Mining Accounts"));
		}
	};
	
}

export default MiningAccountController;
