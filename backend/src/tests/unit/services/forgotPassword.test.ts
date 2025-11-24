import { forgotPassword } from "../../../usecases/user/forgotPassword.usecase";
import { prisma } from "../../../prisma/client";
import crypto from "crypto";

// Mock do Prisma
jest.mock("../../../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Vamos mockar o crypto para garantir que o token seja previsível no teste
jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: () => "token-falso-123"
  })
}));

describe("forgotPassword (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve gerar um token de recuperação se o e-mail existir", async () => {
    // Simula usuário existente
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: "teste@email.com",
    });

    const result = await forgotPassword("teste@email.com");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "teste@email.com" } });
    expect(result).toEqual({
      message: "Token de recuperação gerado",
      resetToken: "token-falso-123", // Valor fixo do mock
      emailSentTo: "teste@email.com"
    });
  });

  it("deve lançar erro se o e-mail não for encontrado", async () => {
    // Simula usuário não encontrado (null)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(forgotPassword("naoexiste@email.com")).rejects.toThrow(
      "Usuário não encontrado"
    );
  });
});