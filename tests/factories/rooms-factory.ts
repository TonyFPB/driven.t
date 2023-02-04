import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId: hotelId,
    },
  });
}

