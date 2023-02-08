import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/rooms-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBookingFromUser(userId: number) {
  const bookingExists = await bookingRepository.findBookingByUserId(userId);

  if (!bookingExists) throw notFoundError();

  return bookingExists;
}

async function postBookingWithUserId(userId: number, roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const bookingByRoom = await bookingRepository.findBookingByRoomId(roomId);
  if (bookingByRoom.length >= room.capacity) throw { name: "ForbiddenError" };

  const ticketUser = await ticketRepository.findTicketByUserId(userId);
  if (!ticketUser) throw { name: "ForbiddenError" };

  const { TicketType, status } = ticketUser;
  if (!TicketType.includesHotel || TicketType.isRemote || status === "RESERVED") {
    throw { name: "ForbiddenError" };
  }

  const createdBooking = bookingRepository.createBooking(userId, roomId);

  return createdBooking;
}

const bookingService = {
  getBookingFromUser,
  postBookingWithUserId,
};

export default bookingService;
