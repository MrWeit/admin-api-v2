// src/controllers/magic.controller.ts

import Controller from "@interfaces/controller.interface";
import {
	Router,
	RequestHandler,
} from "express";
import { validateRequest } from "@middleware/validation.middleware";
import { showSuccess } from "@utils/helper";
import { BadRequestError } from "@utils/http.exceptions";
import LoggerService from "@resources/logger/logger.service";
import {
	AuthenticateMinerSchema,
	authenticateMinerSchema,
} from "./magic.validation";
import authenticatedMagicKeyMiddleware from "@middleware/magic.middleware";
import ClientService from "@resources/client/client.service";
import MiningAccountService, {
	MiningAccountWithPoolAndProxy,
} from "@resources/miningAccount/miningAccount.service";
import MagicService from "./magic.service";

class MagicController implements Controller {
	public path = "/admin/magic";
	public router = Router();
	private log = new LoggerService();
	private clientService = new ClientService();
	private miningAccountService = new MiningAccountService();
	private magicService = new MagicService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		// Authenticate miner
		this.router.post(
			`${this.path}/miner/authenticate`,
			authenticatedMagicKeyMiddleware,
			validateRequest(authenticateMinerSchema),
			this.authenticateMiner
		);

		this.router.post(
			`${this.path}/pool/get-proxy`,
			authenticatedMagicKeyMiddleware,
			this.getPoolProxy
		);
	}

	/**
	 * Authenticates a miner and assigns it to an appropriate mining account.
	 */
	private authenticateMiner: RequestHandler<any, any, AuthenticateMinerSchema> =
		async (req, res, next): Promise<void> => {
			try {
				const {
					worker_name,
					worker_password: password,
					public_ip: publicIp,
					coin,
					instance_id,
				} = req.body;

				//Slits the workerName to have the workerUsername and workerPrefix
				const workerUsername = worker_name.split(".")[0];
				const minerPrefix = worker_name.split(".")[1];

				const client =
					await this.clientService.getClientByWorkerNameIpAndPassword(
						workerUsername,
						password,
						publicIp || ""
					);

				if (!client) {
					this.log.createLog(
						"WARNING",
						"Miner unauthorized",
						JSON.stringify({ ip: req.ip, worker_name, publicIp })
					);
					throw new BadRequestError("Who TF are you? :D");
				}

				// Fetch mining accounts for the client and coin
				const miningAccounts: MiningAccountWithPoolAndProxy[] =
					await this.miningAccountService.getMiningAccountsByClientIdAndCoin(
						client.id,
						coin
					);

					if (!miningAccounts || miningAccounts.length === 0) {
						throw new BadRequestError("No mining accounts available");
					}
					
					// Populate Redis with mining account data
					await this.magicService.populateMiningAccountsInRedis(client.id, miningAccounts);
					

				// Respond with the assigned mining account details
				showSuccess(
					req,
					res,
					"Miner authenticated and assigned to mining account",
					{
						data: {
							client_id: client.id,
						},
					}
				);
			} catch (error: any) {
				await this.log.createLog(
					"ERROR",
					error.message,
					JSON.stringify({ ip: req.ip, url: req.originalUrl })
				);

				//If its an prisma error, sends new message
				if (error.message.includes("prisma")) {
					next(new BadRequestError("Error authenticating miner"));
				}

				next(new BadRequestError(error.message));
			}
		};

	private getPoolProxy: RequestHandler<any, any, AuthenticateMinerSchema> =
		async (req, res, next): Promise<void> => {

			//Gets all proxies
			const proxy = await this.magicService.getRandomProxy();

			showSuccess(req, res, "Pool proxy details", {
				data: {
					pool_url: "btc.viabtc.io",
					pool_port: 3333,
					proxy_address: "isp.oxylabs.io",
					proxy_port: proxy.port,
					proxy_username: "nebolaloop_Mlupa",
					proxy_password: "Nebolaloop123++",
					in_diff: 1048576,
				}
			});
		};

}

export default MagicController;
