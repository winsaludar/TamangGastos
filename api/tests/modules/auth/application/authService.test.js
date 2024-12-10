import * as chai from "chai";

import Auth from "../../../../src/modules/auth/domain/auth.js";
import AuthEmailService from "../../../../src/modules/auth/application/authEmailService.js";
import AuthService from "../../../../src/modules/auth/application/authService.js";
import EmailUtils from "../../../../src/common/utils/emailUtils.js";
import HttpError from "../../../../src/common/errors/httpError.js";
import JwtUtils from "../../../../src/common/utils/jwtUtils.js";
import Token from "../../../../src/modules/token/domain/token.js";
import TokenRepository from "../../../../src/modules/token/infrastructure/tokenRepository.js";
import User from "../../../../src/modules/user/domain/user.js";
import UserRepository from "../../../../src/modules/user/infrastructure/userRepository.js";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
const { expect } = chai;

describe("Auth Service", () => {
  const username = "test-username";
  const email = "test-email@example.com";
  const password = "Password1";
  const tokenString = "test-token";

  let hashedPassword;
  let mockUser;
  let mockToken;
  let mockJwtToken;
  let authService;
  let mockUserRepository;
  let mockTokenRepository;
  let mockJwtUtils;
  let mockEmailUtils;
  let mockAuthEmailService;

  beforeEach(async () => {
    hashedPassword = await Auth.hashPassword(password);
    mockUser = User.create({
      id: 1,
      username,
      email,
      passwordHash: hashedPassword,
    });
    mockToken = Token.create({
      id: 1,
      userId: mockUser.id,
      token: tokenString,
      tokenType: "access",
      expiresAt: new Date(),
    });
    mockJwtToken = {
      id: 1,
      username,
      exp: Math.floor(Date.now() / 1000) + 3600, // Mock a valid expiration (1 hour from now)
    };

    mockUserRepository = sinon.createStubInstance(UserRepository);
    mockTokenRepository = sinon.createStubInstance(TokenRepository);
    mockJwtUtils = sinon.createStubInstance(JwtUtils);
    mockEmailUtils = sinon.createStubInstance(EmailUtils);
    mockAuthEmailService = sinon.createStubInstance(AuthEmailService);
    authService = new AuthService(
      mockUserRepository,
      mockTokenRepository,
      mockJwtUtils,
      mockAuthEmailService
    );
  });

  describe("Register User", () => {
    it("should return a new user object with the new id", async () => {
      // Arrange
      const userId = 1;
      mockJwtUtils.generateToken.resolves("fake-token");
      mockUserRepository.save.resolves(userId);
      mockAuthEmailService.sendEmailConfirmation.resolves({});

      // Act
      const result = await authService.registerUser(username, email, password);
      console.log(result);

      // Assert
      expect(mockUserRepository.save).to.have.been.calledOnce;
      expect(mockTokenRepository.save).to.have.been.calledOnce;
      expect(mockAuthEmailService.sendEmailConfirmation).to.have.been
        .calledOnce;
      expect(result).to.be.not.null;
      expect(result).to.have.property("id").to.be.equal(userId);
      expect(result).to.have.property("username").to.be.equal(username);
      expect(result).to.have.property("email").to.be.equal(email);
    });

    it("should throw HttpError object when email is already exist", async () => {
      try {
        // Arrange
        mockUserRepository.findByUsernameOrEmail.resolves({
          id: 1,
          username,
          email,
        });

        // Act
        await authService.registerUser(null);
      } catch (error) {
        // Assert
        expect(mockUserRepository.save).to.have.been.not.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Username or email already in used");
        expect(error.statusCode).to.be.equal(400);
      }
    });
  });

  describe("Login User", () => {
    it("should return a user object with token if email and password are both valid", async () => {
      // Arrange
      mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
      mockTokenRepository.findByUserId.resolves(mockToken);
      mockJwtUtils.generateToken.resolves(tokenString);

      // Act
      const result = await authService.loginUser(email, password);

      // Assert
      expect(mockUserRepository.findByUsernameOrEmail).to.have.been.calledOnce;
      expect(mockTokenRepository.findByUserId).to.have.been.calledOnce;
      expect(result).to.be.not.null;
      expect(result).to.have.property("user");
      expect(result).to.have.property("token").to.be.equal(tokenString);
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        // Arrange
        const badEmail = "bad-email@example.com";
        mockUserRepository.findByUsernameOrEmail.resolves(null);
        mockJwtUtils.generateToken.resolves(null);

        // Act
        await authService.loginUser(badEmail, password);
      } catch (error) {
        //Assert
        expect(mockUserRepository.findByUsernameOrEmail).to.have.been
          .calledOnce;
        expect(mockJwtUtils.generateToken).to.have.not.been.called;
        expect(mockTokenRepository.findByUserId).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Invalid email or password");
        expect(error.statusCode).to.be.equal(401);
      }
    });

    it("should throw HttpError object when email or password is invalid", async () => {
      try {
        // Arrange
        const badPassword = "bad-password";
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);

        // Act
        await authService.loginUser(email, badPassword);
      } catch (error) {
        // Assert
        expect(mockUserRepository.findByUsernameOrEmail).to.have.been
          .calledOnce;
        expect(mockJwtUtils.generateToken).to.have.not.been.called;
        expect(mockTokenRepository.findByUserId).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Invalid email or password");
        expect(error.statusCode).to.be.equal(401);
      }
    });
  });

  describe("Forgot Password", () => {
    it("should send a forgot password email link", async () => {
      // Arrange
      mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
      mockTokenRepository.findByUserId.resolves(mockToken);
      mockAuthEmailService.sendForgotPasswordUrl.resolves();

      // Act
      await authService.forgotPassword(email);

      // Assert
      expect(mockUserRepository.findByUsernameOrEmail).to.have.been.calledOnce;
      expect(mockAuthEmailService.sendForgotPasswordUrl).to.have.been
        .calledOnce;
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        // Arrange
        const badEmail = "bad-email@example.com";
        mockUserRepository.findByUsernameOrEmail.resolves(null);

        // Act
        await authService.forgotPassword(badEmail);
      } catch (error) {
        // Assert
        expect(mockUserRepository.findByUsernameOrEmail).to.have.been
          .calledOnce;
        expect(mockAuthEmailService.sendForgotPasswordUrl).to.have.not.been
          .called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Email does not exist");
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when user is not yet activated", async () => {
      try {
        // Arrange
        mockUser.isActive = false;
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);

        // Act
        await authService.forgotPassword(email);
      } catch (error) {
        // Assert
        expect(mockUserRepository.findByUsernameOrEmail).to.have.been
          .calledOnce;
        expect(mockAuthEmailService.sendForgotPasswordUrl).to.have.not.been
          .called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Email is inactive, please verify it first"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });
  });

  describe("Reset Password", () => {
    it("should reset the password of the user", async () => {
      // Arrange
      const currentDate = new Date();

      mockJwtUtils.verifyToken.resolves(mockJwtToken);
      mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
      mockTokenRepository.findByTokenValue.resolves(mockToken);
      mockUserRepository.update.resolves(true);
      mockTokenRepository.update.resolves();

      // Act
      await authService.resetPassword(email, password, tokenString);

      // Assert
      expect(mockJwtUtils.verifyToken).to.be.calledOnce;
      expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
      expect(mockTokenRepository.findByTokenValue).to.be.calledOnce;
      expect(mockUserRepository.update).to.be.calledOnce;
      expect(mockTokenRepository.update).to.be.calledOnce;
      expect(mockToken.expiresAt).to.be.lessThan(currentDate); // Should be set to expired
    });

    it("should throw HttpError object when token is invalid", async () => {
      try {
        // Arrange
        const badToken = "bad-token";
        mockJwtUtils.verifyToken.resolves(null);

        // Act
        await authService.resetPassword(email, password, badToken);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.have.not.been
          .called;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Link is invalid, please request a new one"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when token is expired", async () => {
      try {
        // Arrange
        mockJwtToken.exp = Math.floor(Date.now() / 1000) - 3600; // Mock an expired token (1 hour earlier)
        mockJwtUtils.verifyToken.resolves(mockJwtToken);

        // Act
        await authService.resetPassword(email, password, tokenString);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.have.not.been
          .called;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Link is expired, please request a new one"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        // Arrange
        const badEmail = "bad-email@example.com";
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(null);

        // Act
        await authService.resetPassword(badEmail, password, tokenString);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Email does not exist");
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when token does not exist", async () => {
      try {
        // Arrange
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
        mockTokenRepository.findByTokenValue.resolves(null);

        // Act
        await authService.resetPassword(email, password, tokenString);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.be.calledOnce;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Link is invalid, please request a new one"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw Error object when updating password fails", async () => {
      try {
        // Arrange
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
        mockTokenRepository.findByTokenValue.resolves(mockToken);

        // Act
        await authService.resetPassword(email, password, tokenString);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.be.calledOnce;
        expect(mockUserRepository.update).to.be.calledOnce;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.be.equal(
          "Unable to update password, please try again later!"
        );
      }
    });
  });

  describe("Verify Email", () => {
    it("should activate the user", async () => {
      // Arrange
      const currentDate = new Date();
      mockUser.isActive = false;
      mockJwtUtils.verifyToken.resolves(mockJwtToken);
      mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
      mockTokenRepository.findByTokenValue.resolves(mockToken);
      mockUserRepository.update.resolves(true);
      mockTokenRepository.update.resolves();

      // Act
      await authService.verifyEmail(email, tokenString);

      // Assert
      expect(mockJwtUtils.verifyToken).to.be.calledOnce;
      expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
      expect(mockTokenRepository.findByTokenValue).to.be.calledOnce;
      expect(mockUserRepository.update).to.be.calledOnce;
      expect(mockTokenRepository.update).to.be.calledOnce;
      expect(mockToken.expiresAt).to.be.lessThan(currentDate); // Should be expired
      expect(mockUser.isActive).to.be.equal(true);
    });

    it("should throw HttpError object when token is invalid", async () => {
      try {
        // Arrange
        mockJwtUtils.verifyToken.resolves(null);

        // Act
        await authService.verifyEmail(email);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.have.not.been
          .called;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Link is invalid, please request a new one"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when token is expired", async () => {
      try {
        // Arrange
        mockJwtToken.exp = Math.floor(Date.now() / 1000) - 3600; // Mock an expired token (1 hour earlier)
        mockJwtUtils.verifyToken.resolves(mockJwtToken);

        // Act
        await authService.verifyEmail(email);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.have.not.been
          .called;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Link is expired, please request a new one"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        // Arrange
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(null);

        // Act
        await authService.verifyEmail(email);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Email does not exist");
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when user is already activated", async () => {
      try {
        // Arrange
        mockUser.isActive = true;
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);

        // Act
        await authService.verifyEmail(email);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.have.not.been.called;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Email is already verified");
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when token does not exist", async () => {
      try {
        // Arrange
        mockUser.isActive = false;
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
        mockTokenRepository.findByTokenValue.resolves(null);

        // Act
        await authService.verifyEmail(email);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.be.calledOnce;
        expect(mockUserRepository.update).to.have.not.been.called;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal(
          "Link is invalid, please request a new one"
        );
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when activating user fails", async () => {
      try {
        // Arrange
        mockUser.isActive = false;
        mockJwtUtils.verifyToken.resolves(mockJwtToken);
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
        mockTokenRepository.findByTokenValue.resolves(mockToken);
        mockUserRepository.update.resolves(false);

        // Act
        await authService.verifyEmail(email);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.verifyToken).to.be.calledOnce;
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByTokenValue).to.be.calledOnce;
        expect(mockUserRepository.update).to.be.calledOnce;
        expect(mockTokenRepository.update).to.have.not.been.called;
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.be.equal(
          "Unable to active user, please try again later!"
        );
      }
    });
  });

  describe("Re-send Email Confirmation Link", () => {
    it("should re-send the email confirmation link", async () => {
      // Arrange
      mockUser.isActive = false;
      mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
      mockTokenRepository.findByUserId.resolves(mockToken);
      mockAuthEmailService.sendEmailConfirmation.resolves();

      // Act
      await authService.resendEmailConfirmationLink(email);

      // Assert
      expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
      expect(mockTokenRepository.findByUserId).to.be.calledOnce;
      expect(mockAuthEmailService.sendEmailConfirmation).to.be.calledOnce;
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        // Arrange
        mockUser.isActive = false;
        mockUserRepository.findByUsernameOrEmail.resolves(null);

        // Act
        await authService.resendEmailConfirmationLink(email);
      } catch (error) {
        // Assert
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByUserId).to.have.not.been.called;
        expect(mockAuthEmailService.sendEmailConfirmation).to.have.not.been
          .called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Email does not exist");
        expect(error.statusCode).to.be.equal(400);
      }
    });

    it("should throw HttpError object when user is already activated", async () => {
      try {
        // Arrange
        mockUser.isActive = true;
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);

        // Act
        await authService.resendEmailConfirmationLink(email);
      } catch (error) {
        // Assert
        expect(mockUserRepository.findByUsernameOrEmail).to.be.calledOnce;
        expect(mockTokenRepository.findByUserId).to.have.not.been.called;
        expect(mockAuthEmailService.sendEmailConfirmation).to.have.not.been
          .called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Email is already verified");
        expect(error.statusCode).to.be.equal(400);
      }
    });
  });
});
