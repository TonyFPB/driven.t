import { getTickets, getTicketsTypes } from "@/controllers/tickets-controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRoutes = Router();

ticketsRoutes
    .all("/*", authenticateToken)
    .get("/types", getTicketsTypes)
    .get("/", getTickets)
    .post("/");

export { ticketsRoutes }