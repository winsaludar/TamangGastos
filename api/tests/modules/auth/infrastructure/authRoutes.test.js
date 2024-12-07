import Fastify from "fastify";
import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";

// import authRoutes from "../../../../src/modules/auth/infrastructure/authRoutes.js";

chai.use(chaiHttp);

describe("Auth Routes", () => {
  let app;

  before(async () => {
    // Initialize Fastify instance
    app = Fastify();
    await app.register(import("@fastify/jwt"), { secret: "test-secret" });
    // await app.register(authRoutes);
    await app.ready();
  });

  after(async () => {
    // Clean up Fastify instance
    await app.close();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const name = "testname";
      const email = "testemail@example.com";

      const response = await chai.request(app.server).post("/register").send({
        name: name,
        email: email,
        password: "Password123",
      });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("message", "Register successful");
      expect(response.body.data).to.have.property("user");
      expect(response.body.data.user).to.include({ name, email });
    });

    it("should return 400 for invalid request body", async () => {
      const response = await chai
        .request(app.server)
        .post("/register")
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error");
    });
  });
});
