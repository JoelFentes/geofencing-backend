import { prisma } from "../prisma/client";

export interface ReminderDTO {
  title: string;
  description?: string;
  date: string;
  startTime: Date;
  endTime: Date;
  userId: number;
}

export const reminderRepository = {
  async create(data: ReminderDTO) {
    return prisma.reminder.create({ data });
  },

  async listByUser(userId: number) {
    return prisma.reminder.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });
  },

  async delete(id: number, userId: number) {
    return prisma.reminder.deleteMany({
      where: { id, userId },
    });
  },
};
