import { notFoundError } from "@/errors";
import { NewPaymentBody } from "@/protocols";
import paymentRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getPaymentFromUser(userId: number, ticketId: number) {
  if (!ticketId) throw { name: "BadRequestError", message: "Missing ticket id." };

  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw { name: "UnauthorizedError" };

  const payment = await paymentRepository.findPaymentByTicketId(ticketId);
  return payment;
}

async function postPayment(userId: number, payment: NewPaymentBody) {
  const { ticketId, cardData } = payment;
  const { issuer, number } = cardData;
  const cardLastDigits = number.slice(-4);

  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw { name: "UnauthorizedError" };
  if (ticket.status === "PAID") throw { name: "UnprocessableEntityError", message: "Ticket already paid." };

  const { id, TicketType } = ticket;
  const { price } = TicketType;
  const paymentCreated = await paymentRepository.createPaymentByTicketId(id, price, issuer, cardLastDigits);

  await ticketsRepository.updateStatusTicket(id);

  return paymentCreated;
}

const paymentsService = {
  getPaymentFromUser,
  postPayment
};

export default paymentsService;
