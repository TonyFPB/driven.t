import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import httpStatus from "http-status";
import {
  createUser,
  createHotel,
  createRoom,
  createBooking,
  createTicketTypeWithBool,
  createTicket,
  createEnrollmentWithAddress,
} from "../factories";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/payments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/payments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/payments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("Should respond with status 404 when booking from user does not exists", async () => {
      const token = await generateValidToken();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 200 and the booking from user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/payments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/payments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/payments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("Should respond with status 400 the body is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidBody = { roomId: faker.datatype.string() };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("Should respond with status 404 when roomId not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: faker.datatype.number() };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 403 when the room is already occupied", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const userInTheRoom = await createUser();

      const hotel = await createHotel();
      const room = await createRoom(hotel.id, 1);
      const booking = await createBooking(userInTheRoom.id, room.id);

      const ticketType = await createTicketTypeWithBool(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 when ticket from user does not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 when ticket not includes hotel", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const ticketType = await createTicketTypeWithBool(false, false);
      const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 when ticket is remote", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const ticketType = await createTicketTypeWithBool(true, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 when ticket is RESERVED", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const ticketType = await createTicketTypeWithBool(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED");

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 200 and the booking id", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const ticketType = await createTicketTypeWithBool(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");

      const body = { roomId: room.id };

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      const booking = await prisma.booking.findFirst({ where: { userId: user.id } });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
      });
    });
  });
});
