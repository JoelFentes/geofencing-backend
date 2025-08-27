// repositories/UserRepository.ts
import { prisma } from "../prisma/client";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data: { ...data, createdAt: new Date() }
    });
  }
}
