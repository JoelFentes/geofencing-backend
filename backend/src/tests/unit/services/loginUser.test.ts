import { loginUser } from "../../../usecases/user/loginUser.usecase";
import { prisma } from "../../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- MOCKS ---
// Aqui novamente fingimos (mockamos) os comportamentos de banco, bcrypt e JWT.

jest.mock("../../../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(), // Simula busca do usuário
    },
  },
}));

jest.mock("bcrypt");       // Simula a comparação de senha
jest.mock("jsonwebtoken"); // Simula a geração de token

describe("loginUser (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("deve autenticar usuário e retornar token", async () => {
    const fakeUser = {
      id: 1,
      email: "joel@test.com",
      password: "hashedpass",
    };

    // Simula usuário encontrado no banco
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);

    // Simula comparação de senha correta
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Simula geração de token JWT
    (jwt.sign as jest.Mock).mockReturnValue("faketoken");

    // Chama o caso de uso
    const result = await loginUser("joel@test.com", "123456");

    // Verificações
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "joel@test.com" } });
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedpass");
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toEqual({
      user: fakeUser,
      token: "faketoken",
    });
  });

  it("deve lançar erro se o usuário não for encontrado", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(loginUser("naoexiste@test.com", "123456")).rejects.toThrow("User not found");
  });

  it("deve lançar erro se a senha for inválida", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: "joel@test.com",
      password: "hashedpass",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginUser("joel@test.com", "wrongpass")).rejects.toThrow("Invalid credentials");
  });
});