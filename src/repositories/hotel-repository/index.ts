import { prisma } from "@/config";

async function findAllHotels() {
  return prisma.hotel.findMany({});
}

async function findOneHotelById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findAllHotels,
  findOneHotelById,
};
export default hotelRepository;
