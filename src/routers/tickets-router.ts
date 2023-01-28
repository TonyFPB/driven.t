import { getTickets, getTicketsTypes, postNewTicket } from "@/controllers/tickets-controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import ticketSchema from "@/schemas/ticket-schemas";
import { Router } from "express";

const ticketsRoutes = Router();

ticketsRoutes
    .all("/*", authenticateToken)
    .get("/types", getTicketsTypes)
    .get("/", getTickets)
    .post("/", validateBody(ticketSchema), postNewTicket);

export { ticketsRoutes }