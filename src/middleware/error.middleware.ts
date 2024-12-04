import { Request, Response, NextFunction } from 'express';
import ApiError from '@utils/http.exceptions';
import { showError } from '@utils/helper';
import logger from '@utils/logger';

function ErrorMiddleware(
    error: Error & Partial<ApiError>,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status_code = error.statusCode ?? 500;
	const error_message = error.statusCode ? error.message : 'erros.internal_server_error';

    if(status_code  === 500) {
        logger.error(error.message);
    }

	return showError(req, res, [error_message], {status_code, translation: error.options?.translation})
}

export default ErrorMiddleware;