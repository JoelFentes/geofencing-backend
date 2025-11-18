import { reminderRepository, ReminderDTO } from "../../repositories/ReminderRepository";

export async function createReminder(data: ReminderDTO) {
  if (!data.title || !data.date) {
    throw new Error("Título e data são obrigatórios");
  }

  return reminderRepository.create({
    ...data,
    locations: [], 
  });
}
