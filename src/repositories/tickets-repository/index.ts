import { prisma } from "@/config";

async function findAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketFromEnrrolement(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function findTicketById(ticketId: number) {
  return prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      enrollmentId: true,
      status: true,
      Enrollment: {
        select: {
          id: true,
          userId: true,
        },
      },
      TicketType: {
        select: {
          price: true,
        },
      },
    },
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED",
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function updateStatusTicket(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "PAID",
    },
  });
}

const ticketsRepository = {
  findAllTicketsTypes,
  findTicketFromEnrrolement,
  findTicketById,
  createTicket,
  updateStatusTicket,
};
export default ticketsRepository;
