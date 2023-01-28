import { prisma } from "@/config";

async function findPaymentByTicketId(ticketId:number){
    return prisma.payment.findFirst({
        where:{ticketId},
        select:{
            id:true,
            ticketId:true,
            value:true,
            cardIssuer:true,
            cardLastDigits:true,
            createdAt:true,
            updatedAt:true
        }
    })
};


const paymentRepository = {
    findPaymentByTicketId
};

export default paymentRepository;