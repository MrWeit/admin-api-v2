import { Request, Response, NextFunction } from 'express';
import token from '@utils/jwtToken';
import jwt from 'jsonwebtoken';
import HttpException from '@utils/http.exceptions';
import { merge } from 'lodash';
import { Admin } from '@prisma/client';
import Token from '@interfaces/jwt.interface';
import AuthService from '@resources/auth/auth.service';
import LoggerService from '@resources/logger/logger.service';


export interface AuthenticatedRequest<
    TBody = any,
    TParams = any,
    TQuery = any
> extends Request<TParams, any, TBody, TQuery> {
    admin?: Admin;
}

async function authenticatedMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authService = new AuthService();
    const logger = new LoggerService();
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException('Unauthorized', 401, {translation: false}));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException('Unauthorized', 401, {translation: false}));
        }

        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            return next(new HttpException('Unauthorized', 401, { translation: false }));
          }

        const admin = await authService.getAdminAccountById(payload.id as unknown as string);

        if (!admin) {
            return next(new HttpException('Unauthorized', 401, {translation: false}));
        }

        //Adds the user to the req
        merge(req, {admin});

        return next();
    } catch (error: any) {
        await logger.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
        return next(new HttpException('Unauthorized', 401, {translation: false}));
    }
}

export default authenticatedMiddleware;