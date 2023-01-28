import { NewPaymentBody } from "@/protocols";
import dayjs from "dayjs";
import Joi from "joi";

export const createPaymentSchema = Joi.object<NewPaymentBody>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.string().min(13).max(16).regex(/^[0-9]+$/).required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().custom(joiExpirationDateValidate).required(),
    cvv: Joi.string().length(3).regex(/^[0-9]+$/).required()
  }).required()
});

function joiExpirationDateValidate(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  const [month, year] = value.split("/");
  const nowYear = dayjs().year();
  const nowMoth = dayjs().month() + 1;

  if (nowYear === Number(year) && nowMoth >= Number(month)) {
    return helpers.error("any.invalid");
  }
  if (nowYear > Number(year)) {
    return helpers.error("any.invalid");
  }

  return value;
}
