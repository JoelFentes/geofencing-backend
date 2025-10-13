import { listUsers } from "../../../usecases/user/listUsers.usecase";
import { prisma } from "../../../prisma/client";

// --- MOCK DO PRISMA ---
// Aqui simulamos apenas o método findMany do Prisma.
// Não há bcrypt ou JWT, pois aqui só buscamos usuários.

jest.mock("../../../prisma/client", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

describe("listUsers (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks antes de cada teste
  });

  it("deve retornar lista de usuários ordenada por data de criação (desc)", async () => {
    const fakeUsers = [
      { id: 1, name: "Joel", createdAt: new Date() },
      { id: 2, name: "Maria", createdAt: new Date() },
    ];

    // Simula o retorno do banco
    (prisma.user.findMany as jest.Mock).mockResolvedValue(fakeUsers);

    const result = await listUsers();

    // Verifica se chamou o Prisma corretamente
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });

    // Verifica se o resultado é o mesmo da simulação
    expect(result).toBe(fakeUsers);
  });
});
