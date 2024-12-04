import { Request, Response } from "express";
import {
	ResponseError,
	ResponseErrorCodes,
	ResponseErrorParams,
	ResponseStatus,
	ResponseSuccess,
	ResponseSucessParams,
} from "@interfaces/responses.interface";

//--------------Response Functions
//Validation error
export const showError = (
	req: Request,
	res: Response,
	message: string[],
	options: ResponseErrorParams = {}
) => {
	//If translations is undefined
	if (options.translation === undefined) {
		options.translation = true;
	}

	let resData: ResponseError = {
		status: ResponseStatus.error,
		message: message,
		error_code: ResponseErrorCodes.common,
		error_description: options.error_description,
		error: options.error,
	};

	res.status(options?.status_code || 400).json(resData);
};

//Success Response
export const showSuccess = (
	req: Request,
	res: Response,
	message: string,
	options: ResponseSucessParams = {}
) => {
	//If translations is undefined
	if (options.translation === undefined) {
		options.translation = true;
	}

	let resData: ResponseSuccess = {
		status: ResponseStatus.success,
		message: message,
		data: options.data,
	};

	res.status(options.status_code || 200).json(resData);
};
