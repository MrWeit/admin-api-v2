import { Prisma } from "@prisma/client";
import { prisma } from "@utils/prismaClient";

class DockerService {
    public async updateDockerById(id: string, input: Prisma.DockerUpdateInput) {
        return await prisma.docker.update({
            where: { id },
            data: input,
        });
    }

    public async createDocker(input: Prisma.DockerCreateInput) {
        return await prisma.docker.create({
            data: input,
        });
    }

    public async deleteDockerById(id: string) {
        return await prisma.docker.delete({
            where: { id },
        });
    }

    public async getDockers() {
        return await prisma.docker.findMany();
    }
}

export default DockerService;


