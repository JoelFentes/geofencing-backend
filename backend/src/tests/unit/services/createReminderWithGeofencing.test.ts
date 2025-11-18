import { createReminderWithGeofencing } from "../../../usecases/reminder/createReminderWithGeofencing";
import { reminderRepository, ReminderDTO } from "../../../repositories/ReminderRepository";

jest.mock("../../../repositories/ReminderRepository", () => ({
  reminderRepository: {
    create: jest.fn(),
  },
}));

describe("createReminderWithGeofencing (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um lembrete com locais de geofencing", async () => {
    const fakeReminder: ReminderDTO = {
      userId: 1,
      title: "Ir à padaria",
      date: "2025-11-15",
      startTime: new Date(),
      endTime: new Date(),
     
    };

    (reminderRepository.create as jest.Mock).mockResolvedValue(fakeReminder);

    const result = await createReminderWithGeofencing(fakeReminder);

    expect(reminderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        locations: expect.arrayContaining([
          expect.objectContaining({
            name: "Padaria Central",
          }),
        ]),
      })
    );

    expect(result).toEqual(fakeReminder);
  });

  it("deve criar lembrete com múltiplos locais (ex: vindos do Google Places)", async () => {
  const locationsFromGoogle = [
    {
      name: "Padaria Central",
      latitude: -8.12121,
      longitude: -35.98111,
      radiusMeters: 150,
    },
    {
      name: "Supermercado BomPreço",
      latitude: -8.12222,
      longitude: -35.98222,
      radiusMeters: 200,
    },
    {
      name: "Mercadinho da Esquina",
      latitude: -8.12333,
      longitude: -35.98333,
      radiusMeters: 100,
    },
  ];

  const fakeReminder = {
    userId: 1,
    title: "Comprar itens",
    date: "2025-11-15",
    startTime: new Date(),
    endTime: new Date(),
    locations: locationsFromGoogle,
  };

  (reminderRepository.create as jest.Mock).mockResolvedValue(fakeReminder);

  const result = await createReminderWithGeofencing(fakeReminder);

  expect(reminderRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({
      locations: expect.arrayContaining([
        expect.objectContaining({
          name: "Padaria Central",
        }),
        expect.objectContaining({
          name: "Supermercado BomPreço",
        }),
        expect.objectContaining({
          name: "Mercadinho da Esquina",
        }),
      ]),
    })
  );

  expect(result).toEqual(fakeReminder);
});

  it("deve lançar erro se não houver ao menos 1 localização", async () => {
    await expect(
      createReminderWithGeofencing({
        userId: 1,
        title: "Teste",
        date: "2025-11-15",
        startTime: new Date(),
        endTime: new Date(),
      })
    ).rejects.toThrow("É necessário ao menos 1 localização");
  });
});
