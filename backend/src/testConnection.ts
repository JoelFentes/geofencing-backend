// backend/src/testConnection.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao banco!");

    // Tente buscar alguns usuários (ou outro model que exista)
    const users = await prisma.user.findMany();
    console.log("Users:", users);
  } catch (err) {
    console.error("❌ Erro na conexão:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
