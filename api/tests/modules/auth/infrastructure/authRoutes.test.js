import * as chai from "chai";

import { default as chaiHttp, request } from "chai-http";

import { createApp } from "../../../../src/app.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth Routes", () => {
  let app;
  let registeredEmail = "testemail@example.com";
  let registeredPassword = "Password1";

  before(async () => {
    // Initialize Fastify instance
    app = await createApp();
    app.listen();
  });

  after(async () => {
    // Clean up Fastify instance
    await app.close();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const name = "testname";

      const response = await request
        .execute(app.server)
        .post("/api/auth/register")
        .send({
          name: name,
          email: registeredEmail,
          password: registeredPassword,
          retypePassword: registeredPassword,
        });

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("message", "Register successful");
      expect(response.body.data).to.have.property("user");
      expect(response.body.data.user).to.include({
        name,
        email: registeredEmail,
      });
    });

    it("should return 400 for invalid request body", async () => {
      const response = await request
        .execute(app.server)
        .post("/api/auth/register")
        .send({});

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("details");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user successfully", async () => {
      const response = await request
        .execute(app.server)
        .post("/api/auth/login")
        .send({
          email: registeredEmail,
          password: registeredPassword,
        });

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("message", "Login successful");
      expect(response.body.data).to.have.property("user");
      expect(response.body.data.user).to.not.be.null.undefined;
      expect(response.body.data).to.have.property("token");
      expect(response.body.data.token).to.not.be.null.empty;
    });

    it("should return 400 for invalid request body", async () => {
      const response = await request
        .execute(app.server)
        .post("/api/auth/login")
        .send({});

      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("details");
    });

    it("should return 401 for invalid email or password", async () => {
      const response = await request
        .execute(app.server)
        .post("/api/auth/login")
        .send({
          email: "non-existing-user@example.com",
          password: "Password123",
        });

      expect(response).to.have.status(401);
      expect(response.body).to.have.property("message");
    });
  });
});
