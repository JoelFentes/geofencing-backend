// repositories/UserRepository.ts
import { prisma } from "../prisma/client";

export class UserRepository {
  static update(userId: string | undefined, arg1: { name: any; photo: any; }) {
    throw new Error("Method not implemented.");
  }
  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data: { ...data, createdAt: new Date() }
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: { name?: string; photo?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}




