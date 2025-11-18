import { prisma } from "../prisma/client";

export interface GeofenceLocation {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface ReminderDTO {
  title: string;
  date: string;
  startTime: Date;
  endTime: Date;
  userId: number;

  locations?: GeofenceLocation[]; 
}


export const reminderRepository = {
  async create(data: ReminderDTO) {
    return prisma.reminder.create({ data });
  },

  async listByUser(userId: number) {
    return prisma.reminder.findMany({
      where: { userId },
      include: { geofencing: true }, 
      orderBy: { date: "asc" },
    });
  },

  async delete(id: number, userId: number) {
    return prisma.reminder.deleteMany({
      where: { id, userId },
    });
  },
};
