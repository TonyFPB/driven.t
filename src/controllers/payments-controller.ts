import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import paymentsService from "@/services/payments-service";


export async function getOneTicketFromUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { ticketId } = req.query as TicketQuery;
    try {
        const payment = await paymentsService.getPaymentFromUser(userId, Number(ticketId));
        return res.send(payment);
    } catch (error) {
        if (error.name === "BadRequestError") {
            return res.status(httpStatus.BAD_REQUEST).send(error);
        }
        if (error.name === "UnauthorizedError") {
            return res.status(httpStatus.UNAUTHORIZED).send(error);
        }
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export type TicketQuery = { ticketId: string };