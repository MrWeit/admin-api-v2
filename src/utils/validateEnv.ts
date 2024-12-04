import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_URI: str(),
        PORT: port(),
        DEBUG: str(),
        LOGS_CRITICAL_DAYS: port(),
        LOGS_ERROR_DAYS: port(),
        LOGS_WARNING_DAYS: port(),
        LOGS_INFO_DAYS: port(),
        JWT_SECRET_KEY: str(),
        JWT_EXPIRATION: str(),

        MAGIC_PRIVATE_KEY: str(),
    });
}

export default validateEnv;