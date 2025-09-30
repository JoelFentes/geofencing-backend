import { reminderRepository } from "../../repositories/ReminderRepository";

export async function listReminders(userId: number) {
  return reminderRepository.listByUser(userId);
}
