import token from '@utils/jwtToken';
import { omit } from "lodash";
import { LoginAdminUserSchema } from "@resources/auth/auth.validation";
import { Prisma } from '@prisma/client'
import { prisma } from '@utils/prismaClient';
import bcrypt from "bcrypt";

export const adminOmit = ['password'];

class AuthService {

    public async getAdminAccount(username: string) {
        return prisma.admin.findUnique({ where: { username } });
    }

    public async getAdminAccountById(id: string) {
        return prisma.admin.findUnique({ where: { id } });
    }

    public async createAdminAccount(input: Prisma.AdminCreateInput) {
        const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(input.password, salt);
        return prisma.admin.create({ data: {...input, password} });
    }

    private async isValidPassword(password: string, DBpassword: string) {
        try {
            return await bcrypt.compare(password, DBpassword);
        } catch (err) {
            throw new Error("Invalid password");
        }
    }

    /**
     * Attempt to login a user
     */
    public async login(input: LoginAdminUserSchema): Promise<Object | Error> {
        try {
            const admin = await this.getAdminAccount(input.username);

            if (!admin) {
                throw new Error('Wrong username or password');
            }

            if (await this.isValidPassword(input.password, admin.password)) {
                //Checks if the account is verified
                if(admin.status === 'INACTIVE') {
                    throw new Error('Account is not active');
                }
                return {
                    token: token.createJwtToken(admin),
                    admin: omit(admin, adminOmit),
                };
            } else {
                throw new Error('Wrong username or password');
            }
        } catch (error: any) {
            throw new Error(error.message + `- ${input.username}`);
        }
    }
}

export default AuthService;