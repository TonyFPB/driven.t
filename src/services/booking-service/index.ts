import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function getBookingFromUser(userId: number) {
  const bookingExists = await bookingRepository.findBookingByUserId(userId);
  
  if (!bookingExists) throw notFoundError();

  return bookingExists
}

const bookingService = {
  getBookingFromUser,
};

export default bookingService;
