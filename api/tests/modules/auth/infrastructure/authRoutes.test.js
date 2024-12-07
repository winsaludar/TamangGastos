import * as chai from "chai";

import { default as chaiHttp, request } from "chai-http";

import HttpError from "../../../../src/common/errors/httpError.js";
import authRoutes from "../../../../src/modules/auth/infrastructure/authRoutes.js";
import { createApp } from "../../../../src/app.js";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

describe("Auth Routes", () => {
  const username = "test-username";
  const email = "test-email@example.com";
  const password = "123456";

  let app;
  let mockAuthService;

  before(async () => {
    // Mock services needed
    const registerMockServices = (fastify) => {
      const user = {
        id: 1,
        username,
        email,
      };
      const token = "fake-token";
      mockAuthService = {
        registerUser: sinon.stub().resolves(user),
        loginUser: sinon.stub().resolves({ user, token }),
      };
      fastify.decorate("authService", mockAuthService);
    };
    app = await createApp(registerMockServices);
    app.listen();
  });

  after(async () => {
    await app.close();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const dto = {
        username,
        email,
        password,
        retypePassword: password,
      };

      // Act
      const response = await request
        .execute(app.server)
        .post("/api/auth/register")
        .send(dto);

      // Assert
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("message", "Register successful");
      expect(response.body.data).to.have.property("user");
      expect(response.body.data.user).to.include({
        username,
        email,
      });
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await request
        .execute(app.server)
        .post("/api/auth/register")
        .send({});

      // Assert
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("details");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user successfully", async () => {
      // Act
      const response = await request
        .execute(app.server)
        .post("/api/auth/login")
        .send({
          email,
          password,
        });

      // Assert
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("message", "Login successful");
      expect(response.body.data).to.have.property("user");
      expect(response.body.data.user).to.not.be.null.undefined;
      expect(response.body.data).to.have.property("token");
      expect(response.body.data.token).to.not.be.null.empty;
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await request
        .execute(app.server)
        .post("/api/auth/login")
        .send({});

      // Assert
      expect(response).to.have.status(400);
      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("details");
    });

    it("should return 401 for invalid email or password", async () => {
      // Arrange
      const errorMessage = "Invalid email or password";
      mockAuthService.loginUser = sinon
        .stub()
        .throws(new HttpError(errorMessage, 401));

      // Act
      const response = await request
        .execute(app.server)
        .post("/api/auth/login")
        .send({
          email: "non-existing-user@example.com",
          password: "Password123",
        });

      // Assert
      expect(response).to.have.status(401);
      expect(response.body)
        .to.have.property("message")
        .to.be.equals(errorMessage);
    });
  });
});
