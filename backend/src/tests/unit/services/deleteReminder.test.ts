import { deleteReminder } from "../../../usecases/reminder/deleteReminder.usecase";
import { reminderRepository } from "../../../repositories/ReminderRepository";

// MOCK do reminderRepository
jest.mock("../../../repositories/ReminderRepository", () => ({
  reminderRepository: {
    delete: jest.fn(),
  },
}));

describe("deleteReminder (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve deletar um lembrete com sucesso", async () => {
    (reminderRepository.delete as jest.Mock).mockResolvedValue({ count: 1 });

    const result = await deleteReminder(1, 1);

    expect(reminderRepository.delete).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual({ message: "Lembrete excluído com sucesso" });
  });

  it("deve lançar erro se o lembrete não existir ou não pertencer ao usuário", async () => {
    (reminderRepository.delete as jest.Mock).mockResolvedValue({ count: 0 });

    await expect(deleteReminder(1, 1)).rejects.toThrow(
      "Lembrete não encontrado ou não pertence ao usuário"
    );
  });
});
