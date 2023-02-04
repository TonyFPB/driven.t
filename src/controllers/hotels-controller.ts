import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const hotels = await hotelsService.getHotels(userId);
    res.send(hotels);
  } catch (err) {
    if (err.name === "NotFoundError") {
      res.status(httpStatus.NOT_FOUND).send(err);
      return;
    }
    if (err.name === "BadRequestError") {
      res.status(httpStatus.BAD_REQUEST).send(err);
      return;
    }
    if (err.name === "PaymentError") {
      res.status(httpStatus.PAYMENT_REQUIRED).send(err);
      return;
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getOneHotelWithId(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { hotelId } = req.params as ParamnsHotelId;
  try {
    const hotel = await hotelsService.getHotelById(userId, hotelId);
    res.send(hotel);
  } catch (err) {
    if (err.name === "NotFoundError") {
      res.status(httpStatus.NOT_FOUND).send(err);
      return;
    }
    if (err.name === "BadRequestError") {
      res.status(httpStatus.BAD_REQUEST).send(err);
      return;
    }
    if (err.name === "PaymentError") {
      res.status(httpStatus.PAYMENT_REQUIRED).send(err);
      return;
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

type ParamnsHotelId = {
  hotelId: string;
};
