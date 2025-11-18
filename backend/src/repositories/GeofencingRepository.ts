import { prisma } from "../prisma/client";

export interface GeofenceDTO {
  reminderId: number;
  latitude: number;
  longitude: number;
  radius: number;
}

export const geofencingRepository = {
  async createMany(geofences: GeofenceDTO[]) {
    return prisma.geofencing.createMany({
      data: geofences,
    });
  },

  async deleteByReminder(reminderId: number) {
    return prisma.geofencing.deleteMany({
      where: { reminderId },
    });
  },

  async listByReminder(reminderId: number) {
    return prisma.geofencing.findMany({
      where: { reminderId },
    });
  },
};
