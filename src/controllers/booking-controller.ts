import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";

import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const booking = await bookingService.getBookingFromUser(userId);
    res.send(booking);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
  }
}
