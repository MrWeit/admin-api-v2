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
import DockerService from "./docker.service";
import SettingsService from "@resources/settings/settings.service";
import { createDockerSchema, CreateDockerSchema } from "./docker.validation";

class DockerController implements Controller {
	public path = "/admin/docker";
	public router = Router();
	private dockerService = new DockerService();
	private log = new LoggerService();
	private settingsService = new SettingsService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		// Create docker container
		this.router.post(
			`${this.path}/create-docker`,
			authenticatedMiddleware,
			validateRequest(createDockerSchema),
			this.createDocker
		);

		// List all docker containers
		this.router.get(
			`${this.path}/list-docker`,
			authenticatedMiddleware,
			this.listDocker
		);

		// Delete docker container
		this.router.delete(
			`${this.path}/delete-docker/:id`,
			authenticatedMiddleware,
			this.deleteDocker
		);
	}

	private createDocker: RequestHandler = async (
		req: AuthenticatedRequest<CreateDockerSchema>,
		res,
		next
	): Promise<void> => {
		try {
			//Will check if the vpsId is valid
			const settings = await this.settingsService.getSettings();
			if (!settings) {
				throw new Error("Settings not found");
			}

			/*const vps = settings.VPSs.find((vps) => vps.id.toString() === req.body.vpsId);
            if(!vps) {
                throw new Error("VPS not found");
            }*/

			//Will add the docker to the mongoDB and then send a CLI command to the VPS to create the docker
			const { vpsId, ...rest } = req.body;
			const docker = await this.dockerService.createDocker({
				...rest,
				VPS: {
					connect: {
						id: vpsId,
					},
				},
			});

			//Will send the CLI command to the VPS to create the docker
			//TODO: Implement this

			showSuccess(req, res, "Docker container created successfully", {
				data: docker,
			});
		} catch (error: any) {
			await this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error creating docker container"));
		}
	};

	private listDocker: RequestHandler = async (
		req: AuthenticatedRequest,
		res,
		next
	): Promise<void> => {
		try {
			const dockers = await this.dockerService.getDockers();
			showSuccess(req, res, "Docker containers listed successfully", {
				data: dockers,
			});
		} catch (error: any) {
			await this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error listing docker containers"));
		}
	};

	private deleteDocker: RequestHandler = async (
		req: AuthenticatedRequest,
		res,
		next
	): Promise<void> => {
		try {
			//Will check if the docker exists
			const dockers = await this.dockerService.getDockers();
			const docker = dockers.find((docker) => docker.id === req.params.id);
			if (!docker) {
				throw new Error("Docker not found");
			}

			//Will delete the docker from the mongoDB and then send a CLI command to the VPS to delete the docker
			//TODO: Implement this

			//Deletes from db
			await this.dockerService.deleteDockerById(docker.id);
			showSuccess(req, res, "Docker container deleted successfully", {
				data: docker,
			});
		} catch (error: any) {
			this.log.createLog(
				"ERROR",
				error.message,
				JSON.stringify({ ip: req.ip, url: req.originalUrl })
			);
			next(new BadRequestError("Error deleting docker container"));
		}
	};
}

export default DockerController;
