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
  console.log("passei");
  if (ticket.status === "RESERVED") throw { name: "PaymentError", message: "Ticket is not yet paid." };

  const hotels = await hotelRepository.findAllHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;

  // {
  //   id: 18,
  //   name: 'Kara Tromp',
  //   cpf: '71835255892',
  //   birthday: 2023-01-11T20:41:31.672Z,
  //   phone: '(53) 95414-0671',
  //   userId: 51,
  //   createdAt: 2023-02-03T02:21:18.834Z,
  //   updatedAt: 2023-02-03T02:21:18.835Z,
  //   Address: [
  //     {
  //       id: 18,
  //       cep: '09800-8200',
  //       street: 'Derek Pine',
  //       city: 'Seamusberg',
  //       state: 'Minas Gerais',
  //       number: '92086',
  //       neighborhood: 'Raphaellemouth',
  //       addressDetail: null,
  //       enrollmentId: 18,
  //       createdAt: 2023-02-03T02:21:18.834Z,
  //       updatedAt: 2023-02-03T02:21:18.835Z
  //     }
  //   ]
  // }
}

const hotelsService = {
  getHotels,
};

export default hotelsService;
