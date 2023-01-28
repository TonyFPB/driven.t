import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketsWithTypes() {
  const ticketstypes = await ticketsRepository.findAllTicketsTypes();
  return ticketstypes;
}

async function getTicketsUser(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketFromEnrrolement(enrollment.id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function postTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.createTicket(ticketTypeId, enrollment.id);
  return ticket;
}

const ticketsService = { 
  getTicketsWithTypes, 
  getTicketsUser, 
  postTicket 
};

export default ticketsService;
