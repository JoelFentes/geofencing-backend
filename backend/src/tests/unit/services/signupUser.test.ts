import { signupUser } from "../../../usecases/user/signupUser.usecase";
import { prisma } from "../../../prisma/client";
import bcrypt from "bcrypt";


// --- MOCKS ---
// Aqui, estamos "fingindo" o comportamento real das funções do prisma e do bcrypt.
// Isso é importante em testes unitários, pois não queremos mexer no banco de verdade.

jest.mock("../../../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(), // Simula a busca de usuário
      create: jest.fn(),     // Simula a criação de usuário
    },
  },
}));

jest.mock("bcrypt"); // Simula as funções do bcrypt (como hash de senha)

// --- TESTES ---
describe("signupUser (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("deve criar um novo usuário com senha criptografada", async () => {
    // Dizemos que o usuário ainda NÃO existe
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Dizemos que o bcrypt devolve uma senha 'falsa' criptografada
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");

    // Dizemos que o prisma cria o usuário com sucesso
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Joel",
      email: "joel@test.com",
      password: "hashedpass",
    });

    // Chamamos a função que estamos testando
    const result = await signupUser({
      name: "Joel",
      email: "joel@test.com",
      password: "123456",
    });

    // Fazemos as verificações
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "joel@test.com" },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      name: "Joel",
      email: "joel@test.com",
      password: "hashedpass",
    });
  });

  it("deve lançar erro se o e-mail já estiver em uso", async () => {
    // Dizemos que o usuário JÁ existe
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: "joel@test.com" });

    // Esperamos que a função dê erro
    await expect(
      signupUser({ name: "Joel", email: "joel@test.com", password: "123456" })
    ).rejects.toThrow("E-mail já está em uso");
  });
});
