"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const app_1 = __importDefault(require("./app"));
const settings_controller_1 = __importDefault(require("./resources/settings/settings.controller"));
const auth_controller_1 = __importDefault(require("./resources/auth/auth.controller"));
const docker_controller_1 = __importDefault(require("./resources/docker/docker.controller"));
const client_controller_1 = __importDefault(require("./resources/client/client.controller"));
const miningAccount_controller_1 = __importDefault(require("./resources/miningAccount/miningAccount.controller"));
const magic_controller_1 = __importDefault(require("./resources/magic/magic.controller"));
//Controllers
(0, validateEnv_1.default)();
const app = new app_1.default([
    new auth_controller_1.default,
    new settings_controller_1.default,
    new docker_controller_1.default,
    new client_controller_1.default,
    new miningAccount_controller_1.default,
    new magic_controller_1.default,
], Number(process.env.PORT));
app.listen();
