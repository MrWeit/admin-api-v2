// src/controllers/settings.controller.ts

import Controller from "@interfaces/controller.interface";
import { Router, RequestHandler } from "express";
import { validateRequest } from "@middleware/validation.middleware";
import { showSuccess } from "@utils/helper";
import { BadRequestError } from "@utils/http.exceptions";
import authenticatedMiddleware, { AuthenticatedRequest } from "@middleware/auth.middleware";
import LoggerService from "@resources/logger/logger.service";
import SettingsService from "./settings.service";
import { createUpdateSettingsSchema, CreateUpdateSettingsSchema, PostAllProxiesSchema } from "./settings.validation";
import { pingServer } from "@utils/functions";

class SettingsController implements Controller {
    public path = "/admin/settings";
    public router = Router();
    private log = new LoggerService();
    private settingsService = new SettingsService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Create/updates settings
        this.router.post(
            `${this.path}`,
            authenticatedMiddleware,
            validateRequest(createUpdateSettingsSchema),
            this.createUpdateSettings
        );

        // Get settings
        this.router.get(`${this.path}`, authenticatedMiddleware, this.getSettings);

        //Post all proxies
        this.router.post(
            `${this.path}/proxies`,
            authenticatedMiddleware,
            this.postProxies
        );

        this.router.get(
            `${this.path}/proxies`,
            authenticatedMiddleware,
            this.getProxies
        );
    }

    private createUpdateSettings: RequestHandler = async (
        req: AuthenticatedRequest<CreateUpdateSettingsSchema>,
        res,
        next
    ): Promise<void> => {
        try {
            await this.settingsService.createUpdateSettings(req.body);
            const settings = await this.settingsService.getSettingsWithStatus();
            showSuccess(req, res, "Settings updated successfully", { data: settings });
        } catch (error: any) {
            await this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
            next(new BadRequestError("Failed to update settings"));
        }
    };

    private getSettings: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const settings = await this.settingsService.getSettingsWithStatus();
            showSuccess(req, res, "Settings retrieved successfully", { data: settings });
        } catch (error: any) {
            await this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
            next(new BadRequestError("Failed to get settings"));
        }
    };

    private postProxies: RequestHandler = async (
        req: AuthenticatedRequest<PostAllProxiesSchema>,
        res,
        next
    ): Promise<void> => {
        try {
            await this.settingsService.postJsonProxiesList(req.body);
            showSuccess(req, res, "Proxies added successfully");
        } catch (error: any) {
            await this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
            next(new BadRequestError("Failed to add proxies"));
        }
    };

    private getProxies: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const proxies = await this.settingsService.getProxies();

            //Will ping all proxies
            const pingedProxies = await Promise.all(proxies.map(async (proxy) => {
                return {
                    ...proxy,
                    status: await pingServer(proxy.ip) ? "online" : "offline",
                    numberOfMiningAccounts: proxy.miningAccounts.length
                }
            }));

            showSuccess(req, res, "Proxies retrieved successfully", { data: pingedProxies });
        } catch (error: any) {
            await this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
            next(new BadRequestError("Failed to get proxies"));
        }
    };
}

export default SettingsController;
