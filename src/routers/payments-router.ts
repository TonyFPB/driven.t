import { getOneTicketFromUser, postPaymentTicket } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { createPaymentSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getOneTicketFromUser)
  .post("/process", validateBody(createPaymentSchema), postPaymentTicket);

export { paymentsRouter };
