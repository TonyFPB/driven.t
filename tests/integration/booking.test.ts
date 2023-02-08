import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { createUser, createHotel, createRoom } from "../factories";

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
        const token = await generateValidToken()

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`)
    
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    });

    it("Should respond with status 200 and the booking from user", async ()=>{
        const token = await generateValidToken()
        const hotel = await createHotel() 
        const room = await createRoom(hotel.id)
        
    })
  });
});
