import { notFoundError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/tickets-repository";


async function getPaymentFromUser(userId: number, ticketId: number) {
    if(!ticketId) throw {name:"BadRequestError", message:"Missing ticket id."};

    const ticket = await ticketsRepository.findTicketById(ticketId);
    if(!ticket) throw notFoundError();
    if(ticket.Enrollment.userId !== userId) throw {name:"UnauthorizedError"};

    const payment = await paymentRepository.findPaymentByTicketId(ticketId);
    return payment;
}


const paymentsService = {
    getPaymentFromUser
};

export default paymentsService;