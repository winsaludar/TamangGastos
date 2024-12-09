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

  let hashedPassword;
  let authService;
  let mockUserRepository;
  let mockTokenRepository;
  let mockJwtUtils;
  let mockEmailUtils;
  let mockAuthEmailService;

  beforeEach(() => {
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
      hashedPassword = await Auth.hashPassword(password);
      const userId = 1;
      mockJwtUtils.generateToken.resolves("fake-token");
      mockUserRepository.save.resolves(userId);
      mockAuthEmailService.sendEmailConfirmation.resolves({});

      // Act
      const result = await authService.registerUser(username, email, password);
      console.log(result);

      // Assert
      expect(mockUserRepository.save).to.have.been.calledOnce;
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
      const request = { email, password };
      const mockUser = User.create({
        id: 1,
        username: username,
        email: request.email,
        passwordHash: hashedPassword,
      });
      const tokenString = "fake-token";
      const mockToken = Token.create({
        id: 1,
        userId: mockUser.id,
        token: tokenString,
        tokenType: "access",
        expiresAt: new Date(),
      });
      mockUserRepository.findByUsernameOrEmail.resolves(mockUser);
      mockTokenRepository.findByUserId.resolves(mockToken);
      mockJwtUtils.generateToken.resolves(tokenString);

      // Act
      const result = await authService.loginUser(email, password);

      // Assert
      expect(result).to.be.not.null;
      expect(result).to.have.property("user");
      expect(result).to.have.property("token").to.be.equal(tokenString);
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        // Arrange
        const request = { email: "bad-email@example.com", password };
        mockUserRepository.findByUsernameOrEmail.resolves(null);
        mockJwtUtils.generateToken.resolves(null);

        // Act
        await authService.loginUser(request.email, request.password);
      } catch (error) {
        //Assert
        expect(mockJwtUtils.generateToken).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Invalid email or password");
        expect(error.statusCode).to.be.equal(401);
      }
    });

    it("should throw HttpError object when email or password is invalid", async () => {
      try {
        // Arrange
        const request = { email, password: "bad-password" };
        const mockUser = User.create({
          id: 1,
          username: username,
          email: request.email,
          passwordHash: hashedPassword,
        });
        mockUserRepository.findByUsernameOrEmail.resolves(mockUser);

        // Act
        await authService.loginUser(request.email, request.password);
      } catch (error) {
        // Assert
        expect(mockJwtUtils.generateToken).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Invalid email or password");
        expect(error.statusCode).to.be.equal(401);
      }
    });
  });
});
