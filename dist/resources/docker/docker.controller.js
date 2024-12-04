"use strict";
// src/controllers/docker.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const helper_1 = require("../../utils/helper");
const http_exceptions_1 = require("../../utils/http.exceptions");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const logger_service_1 = __importDefault(require("../logger/logger.service"));
const docker_service_1 = __importDefault(require("./docker.service"));
const settings_service_1 = __importDefault(require("../settings/settings.service"));
const docker_validation_1 = require("./docker.validation");
class DockerController {
    constructor() {
        this.path = "/admin/docker";
        this.router = (0, express_1.Router)();
        this.dockerService = new docker_service_1.default();
        this.log = new logger_service_1.default();
        this.settingsService = new settings_service_1.default();
        this.createDocker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Will check if the vpsId is valid
                const settings = yield this.settingsService.getSettings();
                if (!settings) {
                    throw new Error("Settings not found");
                }
                /*const vps = settings.VPSs.find((vps) => vps.id.toString() === req.body.vpsId);
                if(!vps) {
                    throw new Error("VPS not found");
                }*/
                //Will add the docker to the mongoDB and then send a CLI command to the VPS to create the docker
                const _a = req.body, { vpsId } = _a, rest = __rest(_a, ["vpsId"]);
                const docker = yield this.dockerService.createDocker(Object.assign(Object.assign({}, rest), { VPS: {
                        connect: {
                            id: vpsId,
                        },
                    } }));
                //Will send the CLI command to the VPS to create the docker
                //TODO: Implement this
                (0, helper_1.showSuccess)(req, res, "Docker container created successfully", {
                    data: docker,
                });
            }
            catch (error) {
                yield this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error creating docker container"));
            }
        });
        this.listDocker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dockers = yield this.dockerService.getDockers();
                (0, helper_1.showSuccess)(req, res, "Docker containers listed successfully", {
                    data: dockers,
                });
            }
            catch (error) {
                yield this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error listing docker containers"));
            }
        });
        this.deleteDocker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Will check if the docker exists
                const dockers = yield this.dockerService.getDockers();
                const docker = dockers.find((docker) => docker.id === req.params.id);
                if (!docker) {
                    throw new Error("Docker not found");
                }
                //Will delete the docker from the mongoDB and then send a CLI command to the VPS to delete the docker
                //TODO: Implement this
                //Deletes from db
                yield this.dockerService.deleteDockerById(docker.id);
                (0, helper_1.showSuccess)(req, res, "Docker container deleted successfully", {
                    data: docker,
                });
            }
            catch (error) {
                this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error deleting docker container"));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Create docker container
        this.router.post(`${this.path}/create-docker`, auth_middleware_1.default, (0, validation_middleware_1.validateRequest)(docker_validation_1.createDockerSchema), this.createDocker);
        // List all docker containers
        this.router.get(`${this.path}/list-docker`, auth_middleware_1.default, this.listDocker);
        // Delete docker container
        this.router.delete(`${this.path}/delete-docker/:id`, auth_middleware_1.default, this.deleteDocker);
    }
}
exports.default = DockerController;
