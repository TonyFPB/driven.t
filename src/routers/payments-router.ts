import { getOneTicketFromUser } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";


const paymentsRouter = Router();

paymentsRouter
    .all("/*",authenticateToken)
    .get("/",getOneTicketFromUser)
    .post("/process");

export {paymentsRouter};