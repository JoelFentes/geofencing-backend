import { createReminderWithGeofencing } from "../../../usecases/reminder/createReminderWithGeofencing";
import { reminderRepository, ReminderDTO } from "../../../repositories/ReminderRepository";

// MOCK do repositório
jest.mock("../../../repositories/ReminderRepository", () => ({
  reminderRepository: {
    create: jest.fn(),
  },
}));

describe("createReminderWithGeofencing (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um lembrete com geofencing corretamente", async () => {
    const fakeData: ReminderDTO = {
    userId: 1,
    title: "Chegar no trabalho",
    date: new Date().toISOString(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // +1h
    geofencing: {
        create: [{ latitude: -10, longitude: -20, radius: 100 }]
    }
    };

    (reminderRepository.create as jest.Mock).mockResolvedValue(fakeData);

    const result = await createReminderWithGeofencing(fakeData);

    expect(reminderRepository.create).toHaveBeenCalledWith(fakeData);
    expect(result).toEqual(fakeData);
  });

  it("deve lançar erro se o array de geofence estiver vazio", async () => {
    const invalidData: ReminderDTO = {
    userId: 1,
    title: "Teste erro",
    date: new Date().toISOString(),
    startTime: new Date(),
    endTime: new Date(),
    geofencing: { create: [] }
    };

    await expect(createReminderWithGeofencing(invalidData)).rejects.toThrow(
      "É necessário ao menos 1 geofence para criar o lembrete."
    );
    
    // Garante que não tentou salvar no banco
    expect(reminderRepository.create).not.toHaveBeenCalled();
  });

  it("deve lançar erro se título ou data faltarem", async () => {
    const invalidData: any = {
    userId: 1,
    date: "",
    startTime: new Date(),
    endTime: new Date(),
    };

    await expect(createReminderWithGeofencing(invalidData)).rejects.toThrow(
      "Título e data são obrigatórios"
    );
  });
});