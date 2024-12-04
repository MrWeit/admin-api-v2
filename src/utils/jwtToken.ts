import jwt from 'jsonwebtoken';
import Token from '@interfaces/jwt.interface';
import { Admin } from '@prisma/client';

export const createJwtToken = (admin: Admin): string => {
    return jwt.sign({ id: admin.id }, process.env.JWT_SECRET_KEY as jwt.Secret, {
        expiresIn: process.env.JWT_EXPIRATION || '12h',
    });
};

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);

                resolve(payload as Token);
            }
        );
    });
};

export default { createJwtToken, verifyToken };