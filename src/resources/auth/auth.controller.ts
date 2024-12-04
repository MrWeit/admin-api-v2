import Controller from "@interfaces/controller.interface";
import { Router, RequestHandler } from "express";
import { BadRequestError } from "@utils/http.exceptions";
import { showSuccess } from "@utils/helper";
import AuthService, { adminOmit } from "@resources/auth/auth.service";
import { validateRequest } from "@middleware/validation.middleware";
import { LoginAdminUserSchema, loginAdminUserSchema } from "./auth.validation";
import LoggerService from "@resources/logger/logger.service";
import authenticatedMiddleware, { AuthenticatedRequest } from "@middleware/auth.middleware";
import { omit } from "lodash";


//------------------- AdminAuthController -------------------//
class AdminAuthController implements Controller {
	public path = "/admin/auth";
	public router = Router();
	private AuthService = new AuthService();
	private log = new LoggerService();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post(
			`${this.path}/login`,
			validateRequest(loginAdminUserSchema),
			this.login
		);

		this.router.get(
			`${this.path}/getAccount`,
			authenticatedMiddleware,
			this.getAccount
		)
	}

	private login: RequestHandler<{}, any, LoginAdminUserSchema> = async (req, res, next): Promise<void> => {
		try {
			const TokenAndUser = await this.AuthService.login(req.body);
			showSuccess(req, res, "Login Successful", { data: TokenAndUser });
		} catch (error: any) {
			await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
			next(new BadRequestError(error.message));
		}
	};

	private getAccount: RequestHandler = async (
		req: AuthenticatedRequest,
		res,
		next
	): Promise<void> => {
		try {
			const user = omit(req.admin, adminOmit);

			showSuccess(req, res, "User Account", { data: user });
		} catch (error: any) {
			await this.log.createLog('WARNING', error.message, JSON.stringify({ip: req.ip, url: req.originalUrl}));
			next(new BadRequestError(error.message));
		}
	};
}

export default AdminAuthController;