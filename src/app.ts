import express, { Application, Request } from "express";
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from "morgan";

//Utils
import logger from '@utils/logger';
import Controller from "@interfaces/controller.interface";
import ErrorMiddleware from "@middleware/error.middleware";
import { prisma } from "@utils/prismaClient";

class App {
	public express: Application;
	public port: number;
	private initialRoute: string = '/api';

	constructor(controllers: Controller[], port: number = Number(process.env.PORT) | 3000) {
		this.express = express();
		this.port = port;

		this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
	}

	private initializeMiddleware(): void {
		this.express.use(helmet());
		this.express.use(cors({ origin: '*' }));
		this.express.use(morgan('dev'));
		this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
	}

	private initializeControllers(controllers: Controller[]): void {
		controllers.forEach((controller: Controller) => {
			this.express.use(this.initialRoute, controller.router);
		});
	}

	private initializeErrorHandling(): void {
		this.express.use(ErrorMiddleware);
	}

	private initializeDatabaseConnection(): void {
		prisma.$connect();
		logger.info('DATABASE CONNECTED');
	}

	public listen(): void {
		this.express.listen(this.port, () => {
			logger.info('API IS RUNING')
		})
	}
}

export default App;