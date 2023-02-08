import { getBooking } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/",getBooking)
  .post("/")
  .put("/:bookingId");

export { bookingRouter };
