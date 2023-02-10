import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findBookingById(bookingId: number) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId: roomId },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function upsertBooking(userId: number, roomId: number, bookingId?: number) {
  return prisma.booking.upsert({
    where: { id: bookingId || 0 },
    create: {
      roomId: roomId,
      userId: userId,
    },
    update: {
      roomId: roomId,
      userId: userId,
    },
    select:{
      id:true
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoomId,
  createBooking,
  findBookingById,
  upsertBooking
};

export default bookingRepository;
