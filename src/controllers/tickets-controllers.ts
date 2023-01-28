import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";


export async function getTicketsTypes(req: Request, res: Response) {
    try {
        const ticketsTypes = await ticketsService.getTicketsWithTypes();
        res.send(ticketsTypes);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    try {
        const ticketUser = await ticketsService.getTicketsUser(userId);
        res.send(ticketUser);
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}