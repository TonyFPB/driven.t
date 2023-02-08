import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";

import { Response, Request } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const booking = await bookingService.getBookingFromUser(userId);
    return res.send(booking);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { roomId } = req.body as RoomBooking;

  try {
    const bookingCreated = await bookingService.postBookingWithUserId(userId, roomId);
    return res.send(bookingCreated);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    if (err.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send(err);
    }
  }
}

type RoomBooking = {
  roomId: number;
};
