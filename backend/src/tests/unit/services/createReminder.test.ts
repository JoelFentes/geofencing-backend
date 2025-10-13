import { createReminder } from "../../../usecases/reminder/createReminder.usecase";
import { reminderRepository, ReminderDTO } from "../../../repositories/ReminderRepository";

// MOCK do reminderRepository
jest.mock("../../../repositories/ReminderRepository", () => ({
  reminderRepository: {
    create: jest.fn(),
  },
}));

describe("createReminder (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks antes de cada teste
  });

  it("deve criar um lembrete com título, data e horários", async () => {
    // Criamos o mock com todos os campos do ReminderDTO
    const fakeReminder: ReminderDTO = { 
      userId: 1,
      title: "Comprar leite",
      date: new Date().toISOString(), // string
      startTime: new Date(),           // Date
      endTime: new Date(),             // Date
    };

    (reminderRepository.create as jest.Mock).mockResolvedValue(fakeReminder);

    const result = await createReminder({ 
      userId: 1,
      title: "Comprar leite",
      date: new Date().toISOString(),
      startTime: new Date(),
      endTime: new Date(),
    });

    expect(reminderRepository.create).toHaveBeenCalled(); // Verifica se chamou o repository
    expect(result).toEqual(fakeReminder);
  });

  it("deve lançar erro se não passar título ou data", async () => {
    await expect(createReminder({ 
      userId: 1,
      title: "",
      date: "",              // string vazia para disparar erro
      startTime: new Date(), 
      endTime: new Date(),
    })).rejects.toThrow("Título e data são obrigatórios");
  });
});
