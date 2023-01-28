import Joi from "joi";
import { TicketTypeId } from "@/protocols";

const ticketSchema = Joi.object<TicketTypeId>({
    ticketTypeId:Joi.number().required()
});

export default ticketSchema;