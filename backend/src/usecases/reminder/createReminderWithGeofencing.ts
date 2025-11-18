import { reminderRepository, ReminderDTO } from "../../repositories/ReminderRepository";

export async function createReminderWithGeofencing(data: ReminderDTO) {
  if (!data.title || !data.date) {
    throw new Error("Título e data são obrigatórios");
  }

  if (!data.locations || data.locations.length === 0) {
    throw new Error("É necessário ao menos 1 localização para criar um geofencing");
  }

  return reminderRepository.create({
    ...data,
    locations: data.locations,
  });
}
