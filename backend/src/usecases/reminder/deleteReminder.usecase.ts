import { reminderRepository } from "../../repositories/ReminderRepository";

export async function deleteReminder(id: number, userId: number) {
  const result = await reminderRepository.delete(id, userId);
  if (result.count === 0) {
    throw new Error("Lembrete não encontrado ou não pertence ao usuário");
  }
  return { message: "Lembrete excluído com sucesso" };
}
