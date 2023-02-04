import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  const enrollmentUserExists = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentUserExists) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollmentUserExists.id);
  if (!ticket) throw notFoundError();

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw { name: "BadRequestError", message: "Hotel not includes." };
  }

  if (ticket.status === "RESERVED") throw { name: "PaymentError", message: "Ticket is not yet paid." };

  const hotels = await hotelRepository.findAllHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelById(userId: number, hotelId: string) {
  if (isNaN(Number(hotelId))) throw notFoundError();

  const enrollmentUserExists = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentUserExists) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollmentUserExists.id);
  if (!ticket) throw notFoundError();

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw { name: "BadRequestError", message: "Hotel not includes." };
  }

  if (ticket.status === "RESERVED") throw { name: "PaymentError", message: "Ticket is not yet paid." };

  const hotel = await hotelRepository.findOneHotelById(Number(hotelId));

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  getHotels,
  getHotelById,
};

export default hotelsService;
