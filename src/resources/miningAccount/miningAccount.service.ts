import { prisma } from "@utils/prismaClient";
import { Coins, Prisma } from "@prisma/client";

//exports type mining account with pool
export type MiningAccountWithPoolAndProxy = Prisma.MiningAccountGetPayload<{
    include: {
        pool: true;
        proxy: true;
    }
}>;

class MiningAccountService {
    async createMiningAccount(data: Prisma.MiningAccountCreateInput) {
        return await prisma.miningAccount.create({
            data
        });
    }

    async getMiningAccountById(id: string) {
        return await prisma.miningAccount.findUnique({
            where: {
                id
            }
        });
    }

    async getMiningAccountsByIdWithPoolAndProxy(id: string) {
        return await prisma.miningAccount.findUnique({
            where: {
                id
            },
            include: {
                pool: true,
                proxy: true
            }
        });
    }

    async getMiningAccountsByClientIdAndCoin(clientId: string, coin: Coins) {
        return await prisma.miningAccount.findMany({
            where: {
                clientId,
                coin
            },
            include: {
                pool: true,
                proxy: true
            }
        });
    }

    async getMiningAccounts() {
        return await prisma.miningAccount.findMany();
    }

    async updateMiningAccount(id: string, data: Prisma.MiningAccountUpdateInput) {
        return await prisma.miningAccount.update({
            where: {
                id
            },
            data
        });
    }

    async deleteMiningAccount(id: string) {
        return await prisma.miningAccount.delete({
            where: {
                id
            }
        });
    }

    async createMultipleMiningAccounts(data: Prisma.MiningAccountCreateInput[]) {
        const createdAccounts = [];
        for (const accountData of data) {
            const createdAccount = await prisma.miningAccount.create({
                data: accountData,
            });
            createdAccounts.push(createdAccount);
        }
        return createdAccounts;
    }
    
    async getProxies() {
        return await prisma.proxy.findMany({
            include: {
                miningAccounts: true,
            },
        });
    }
}

export default MiningAccountService;