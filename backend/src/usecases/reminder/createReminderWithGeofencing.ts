import { reminderRepository, ReminderDTO } from "../../repositories/ReminderRepository";

export async function createReminderWithGeofencing(data: ReminderDTO) {
    
    // 1. Desestrutura para isolar o campo 'locations' (que é obsoleto) e capturar o restante ('rest')
    // 'rest' contém title, date, userId e o bloco geofencing: { create: [...] }
    const { locations, ...rest } = data; 
    
    if (!rest.title || !rest.date) {
        throw new Error("Título e data são obrigatórios");
    }

    // 2. [Opcional] Checagem de Geofencing: Verifica se há pelo menos um geofence
    const geofences = rest.geofencing as { create: any[] } | undefined;

    if (geofences && geofences.create && geofences.create.length === 0) {
        throw new Error("É necessário ao menos 1 geofence para criar o lembrete.");
    }
    
    // 3. Chama o repositório APENAS com os dados válidos para o Prisma ('rest'), 
    // excluindo o campo 'locations' permanentemente.
    return reminderRepository.create(rest); 
}