import { prisma } from "@/config";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
    select: {
      id: true,
      ticketId: true,
      value: true,
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function createPaymentByTicketId(ticketId: number, value: number, cardIssuer: string, cardLastDigits: string) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer,
      cardLastDigits,
    },
    select: {
      id: true,
      ticketId: true,
      value: true,
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

const paymentRepository = {
  findPaymentByTicketId,
  createPaymentByTicketId,
};

export default paymentRepository;
