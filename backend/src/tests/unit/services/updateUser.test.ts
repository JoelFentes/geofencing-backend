import { UpdateUserUseCase } from "../../../usecases/user/updateUser.usecase"; 

describe("UpdateUserUseCase (unit)", () => {
  // Criamos um objeto mock que imita o UserRepository
  const mockUserRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  // Instanciamos o UseCase passando o mock
  const updateUserUseCase = new UpdateUserUseCase(mockUserRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar o usuário com sucesso", async () => {
    // 1. Simula que o usuário existe
    mockUserRepository.findById.mockResolvedValue({ id: 1, name: "Antigo" });
    
    // 2. Simula o update
    mockUserRepository.update.mockResolvedValue({ id: 1, name: "Novo Nome", photo: "foto.png" });

    const result = await updateUserUseCase.execute({
      userId: 1,
      name: "Novo Nome",
      photo: "foto.png"
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    expect(mockUserRepository.update).toHaveBeenCalledWith(1, { name: "Novo Nome", photo: "foto.png" });
    expect(result).toEqual({ id: 1, name: "Novo Nome", photo: "foto.png" });
  });

  it("deve lançar erro se o usuário não for encontrado", async () => {
    // Simula retorno null (usuário não existe)
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute({ userId: 99, name: "Teste" })
    ).rejects.toThrow("Usuário não encontrado");

    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });
});