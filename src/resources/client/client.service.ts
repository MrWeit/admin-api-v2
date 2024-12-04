import { Prisma } from "@prisma/client";
import { prisma } from "@utils/prismaClient";



class ClientService {
    public async createClient(data: Prisma.ClientCreateInput) {
        return await prisma.client.create({
            data
        });
    }

    public async getClientById(id: string) {
        return await prisma.client.findUnique({
            where: {
                id
            }
        });
    }

    public async getClientByWorkerNameIpAndPassword(workerName: string, password: string, publicIp: string) {
        return await prisma.client.findFirst({
            where: {
                workerName,
                password
            }
        });
    }

    public async getAllClients() {
        return await prisma.client.findMany();
    }

    public async updateClient(id: string, data: Prisma.ClientUpdateInput) {
        return await prisma.client.update({
            where: {
                id
            },
            data
        });
    }

    public async deleteClient(id: string) {
        return await prisma.client.delete({
            where: {
                id
            }
        });
    }
}

export default ClientService;