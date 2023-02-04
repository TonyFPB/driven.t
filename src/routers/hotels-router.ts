import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getAllHotels, getOneHotelWithId } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken).get("/", getAllHotels).get("/:hotelId", getOneHotelWithId);

export { hotelsRouter };
