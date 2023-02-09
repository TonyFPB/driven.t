import Joi from "joi";

export const bookingSchema = Joi.object<BookingSchema>({
  roomId: Joi.number().positive().required(),
});

type BookingSchema = {
  roomId: number;
};
