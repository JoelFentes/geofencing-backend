import { listReminders } from "../../../usecases/reminder/listReminders.usecase";
import { reminderRepository } from "../../../repositories/ReminderRepository";

// MOCK do reminderRepository
jest.mock("../../../repositories/ReminderRepository", () => ({
  reminderRepository: {
    listByUser: jest.fn(),
  },
}));

describe("listReminders (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar a lista de lembretes do usuário", async () => {
    const fakeReminders = [
      { id: 1, userId: 1, title: "Comprar leite", date: new Date() },
      { id: 2, userId: 1, title: "Estudar React", date: new Date() },
    ];

    (reminderRepository.listByUser as jest.Mock).mockResolvedValue(fakeReminders);

    const result = await listReminders(1);

    expect(reminderRepository.listByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(fakeReminders);
  });
});
