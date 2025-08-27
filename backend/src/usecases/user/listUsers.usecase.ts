import { prisma } from "../../prisma/client";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
}
