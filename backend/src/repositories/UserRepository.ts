// repositories/UserRepository.ts
import { prisma } from "../prisma/client";

interface UserCreateData {
  name: string;
  email: string;
  password: string;
  photo?: string | null;
}


export class UserRepository {
  static update(userId: number, data: { name?: string; photo?: string }) 
  {    
    return prisma.user.update({
        where: { id: userId },
        data,
    });
  }
  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: UserCreateData) {
    return prisma.user.create({
      data: { 
        ...data, 
        createdAt: new Date(),
        photo: data.photo || null 
      }
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




