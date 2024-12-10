import * as chai from "chai";

import Fastify from "fastify";
import ajvErrors from "ajv-errors";
import authRoutes from "../../../../src/modules/auth/infrastructure/authRoutes.js";
import { default as chaiHttp } from "chai-http";
import errorHandler from "../../../../src/common/middlewares/errorHandler.js";
import sinon from "sinon";

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth Routes", () => {
  const username = "test-username";
  const email = "test-email@example.com";
  const password = "123456";
  const tokenString = "test-token";

  let fastify;
  let mockAuthService;

  before(async () => {
    fastify = Fastify({
      logger: false,
      ajv: {
        customOptions: {
          allErrors: true,
          $data: true,
        },
        plugins: [ajvErrors],
      },
    });

    // Register custom error handler
    fastify.setErrorHandler(errorHandler);

    // Register a mock service
    const user = {
      id: 1,
      username,
      email,
    };
    const token = "fake-token";
    mockAuthService = {
      registerUser: sinon.stub().resolves(user),
      loginUser: sinon.stub().resolves({ user, token }),
      forgotPassword: sinon.stub().resolves(),
      resetPassword: sinon.stub().resolves(),
      verifyEmail: sinon.stub().resolves(),
      resendEmailConfirmationLink: sinon.stub().resolves(),
    };
    fastify.decorate("authService", mockAuthService);

    // Register the routes
    fastify.register(authRoutes, { prefix: "/api/auth" });

    await fastify.ready();
  });

  after(async () => {
    await fastify.close();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const request = {
        username,
        email,
        password,
        retypePassword: password,
      };

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(200);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message", "Register successful");
      expect(responseData.data).to.have.property("user");
      expect(responseData.data.user).to.include({
        username,
        email,
      });
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: {},
      });

      // Assert
      expect(response).to.have.status(400);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
      expect(responseData).to.have.property("details");
    });

    it("should return 500 for internal server error", async () => {
      // Arrange
      const request = {
        username,
        email,
        password,
        retypePassword: password,
      };
      mockAuthService.registerUser.rejects(new Error("Oops!"));

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(500);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
    });
  });

  describe("POST /login", () => {
    it("should login user successfully", async () => {
      // Arrange
      const request = {
        email,
        password,
      };

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(200);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message", "Login successful");
      expect(responseData.data).to.have.property("token");
      expect(responseData.data).to.have.property("user");
      expect(responseData.data.user).to.include({ username, email });
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {},
      });

      // Assert
      expect(response).to.have.status(400);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
      expect(responseData).to.have.property("details");
    });

    it("should return 500 for internal server error", async () => {
      // Arrange
      const request = {
        email,
        password,
      };
      mockAuthService.loginUser.rejects(new Error("Oops!"));

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(500);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
    });
  });

  describe("POST /forgot-password", () => {
    it("should forgot password successfully", async () => {
      // Arrange
      const request = { email };

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/forgot-password",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(200);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property(
        "message",
        "Forgot password successful"
      );
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/forgot-password",
        payload: {},
      });

      // Assert
      expect(response).to.have.status(400);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
      expect(responseData).to.have.property("details");
    });

    it("should return 500 for internal server error", async () => {
      // Arrange
      const request = { email };
      mockAuthService.forgotPassword.rejects(new Error("Oops!"));

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/forgot-password",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(500);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
    });
  });

  describe("POST /reset-password", () => {
    it("should reset password successfully", async () => {
      // Arrange
      const request = {
        email,
        password,
        retypePassword: password,
        token: tokenString,
      };

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/reset-password",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(200);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property(
        "message",
        "Reset password successful"
      );
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/reset-password",
        payload: {},
      });

      // Assert
      expect(response).to.have.status(400);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
      expect(responseData).to.have.property("details");
    });

    it("should return 500 for internal server error", async () => {
      // Arrange
      const request = {
        email,
        password,
        retypePassword: password,
        token: tokenString,
      };
      mockAuthService.resetPassword.rejects(new Error("Oops!"));

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/reset-password",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(500);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
    });
  });

  describe("POST /validate-email", () => {
    it("should validate email successfully", async () => {
      // Arrange
      const request = {
        email,
        token: tokenString,
      };

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/validate-email",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(200);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property(
        "message",
        "Validate email successful"
      );
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/validate-email",
        payload: {},
      });

      // Assert
      expect(response).to.have.status(400);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
      expect(responseData).to.have.property("details");
    });

    it("should return 500 for internal server error", async () => {
      // Arrange
      const request = {
        email,
        token: tokenString,
      };
      mockAuthService.verifyEmail.rejects(new Error("Oops!"));

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/validate-email",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(500);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
    });
  });

  describe("POST /resend-email-confirmation", () => {
    it("should resend email confirmation successfully", async () => {
      // Arrange
      const request = { email };

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/resend-email-confirmation",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(200);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property(
        "message",
        "Re-send email confirmation link successful"
      );
    });

    it("should return 400 for invalid request body", async () => {
      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/resend-email-confirmation",
        payload: {},
      });

      // Assert
      expect(response).to.have.status(400);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
      expect(responseData).to.have.property("details");
    });

    it("should return 500 for internal server error", async () => {
      // Arrange
      const request = { email };
      mockAuthService.resendEmailConfirmationLink.rejects(new Error("Oops!"));

      // Act
      const response = await fastify.inject({
        method: "POST",
        url: "/api/auth/resend-email-confirmation",
        payload: request,
      });

      // Assert
      expect(response).to.have.status(500);
      const responseData = JSON.parse(response.payload);
      expect(responseData).to.have.property("message");
    });
  });
});
