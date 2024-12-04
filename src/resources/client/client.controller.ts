import Controller from "@interfaces/controller.interface";
import { Router, RequestHandler } from "express";
import { BadRequestError } from "@utils/http.exceptions";
import { showSuccess } from "@utils/helper";
import { validateRequest } from "@middleware/validation.middleware";
import LoggerService from "@resources/logger/logger.service";
import ClientService from "./client.service";
import { CreateClientSchema, createClientSchema } from "./client.validation";
import authenticatedMiddleware, { AuthenticatedRequest } from "@middleware/auth.middleware";

class ClientController implements Controller {
	public path = "/admin/client";
	public router = Router();
	private clientService = new ClientService();
	private log = new LoggerService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post(
			`${this.path}/create`,
            authenticatedMiddleware,
			validateRequest(createClientSchema),
			this.createClient
		);

        this.router.get(
            `${this.path}/get/:id`,
            authenticatedMiddleware,
            this.getClient
        );

        this.router.get(
            `${this.path}/get`,
            authenticatedMiddleware,
            this.getAllClients
        );

        this.router.put(
            `${this.path}/update/:id`,
            authenticatedMiddleware,
            validateRequest(createClientSchema),
            this.updateClient
        );

        this.router.delete(
            `${this.path}/delete/:id`,
            authenticatedMiddleware,
            this.deleteClient
        );
	}

	private createClient: RequestHandler = async (
		req: AuthenticatedRequest<CreateClientSchema>,
		res,
		next
	): Promise<void> => {
		try {
			const client = await this.clientService.createClient(req.body);
			showSuccess(req, res, "Client Created", { data: client });
		} catch (error: any) {
			await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
			next(new BadRequestError("Error creating client"));
		}
	};

    private getClient: RequestHandler = async (
        req: AuthenticatedRequest<any, {id?: string}>,
        res,
        next
    ): Promise<void> => {
        try {
            if(!req.params.id) {
                throw new BadRequestError("Client ID is required");
            }
            const client = await this.clientService.getClientById(req.params.id);
            showSuccess(req, res, "Client Retrieved", { data: client });
        } catch (error: any) {
            await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
            next(new BadRequestError("Error retrieving client"));
        }
    }

    private getAllClients: RequestHandler = async (
        req: AuthenticatedRequest,
        res,
        next
    ): Promise<void> => {
        try {
            const clients = await this.clientService.getAllClients();
            showSuccess(req, res, "Clients Retrieved", { data: clients });
        } catch (error: any) {
            await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
            next(new BadRequestError("Error retrieving clients"));
        }
    }

    private updateClient: RequestHandler = async (
        req: AuthenticatedRequest<CreateClientSchema, {id?: string}>,
        res,
        next
    ): Promise<void> => {
        try {
            if(!req.params.id) {
                throw new BadRequestError("Client ID is required");
            }
            const client = await this.clientService.updateClient(req.params.id, req.body);
            showSuccess(req, res, "Client Updated", { data: client });
        } catch (error: any) {
            await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
            next(new BadRequestError("Error updating client"));
        }
    }

    private deleteClient: RequestHandler = async (
        req: AuthenticatedRequest<any, {id?: string}>,
        res,
        next
    ): Promise<void> => {
        try {
            if(!req.params.id) {
                throw new BadRequestError("Client ID is required");
            }
            const client = await this.clientService.deleteClient(req.params.id);

            showSuccess(req, res, "Client Deleted", { data: client });
        } catch (error: any) {
            await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
            next(new BadRequestError("Error deleting client"));
        }
    }

}

export default ClientController;