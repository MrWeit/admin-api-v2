import 'dotenv/config';
import validateEnv from '@utils/validateEnv';
import App from './app';
import SettingsController from './resources/settings/settings.controller';
import AdminAuthController from './resources/auth/auth.controller';
import DockerController from './resources/docker/docker.controller';
import ClientController from '@resources/client/client.controller';
import MiningAccountController from '@resources/miningAccount/miningAccount.controller';
import MagicController from '@resources/magic/magic.controller';
//Controllers

validateEnv();

const app = new App(
    [
        new AdminAuthController,
        new SettingsController,
        new DockerController,
        new ClientController,
        new MiningAccountController,
        new MagicController,
    ],
    Number(process.env.PORT)
);

app.listen();