import * as chai from "chai";

import Auth from "../../../../src/modules/auth/domain/auth.js";
import AuthService from "../../../../src/modules/auth/application/authService.js";
import HttpError from "../../../../src/common/errors/httpError.js";
import InMemoryUserRepository from "../../../../src/modules/user/infrastructure/repositories/userRepository.js";
import JwtUtils from "../../../../src/common/utils/jwtUtils.js";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
const { expect } = chai;

describe("Auth Service", () => {
  const name = "testname";
  const email = "testemail@example.com";
  const password = "Password1";
  let hashedPassword;
  let authService;
  let mockUserRepository;
  let mockJwtUtils;

  beforeEach(() => {
    mockUserRepository = sinon.createStubInstance(InMemoryUserRepository);
    mockJwtUtils = sinon.createStubInstance(JwtUtils);
    authService = new AuthService(mockUserRepository, mockJwtUtils);
  });

  describe("Register User", () => {
    it("should return a new user object with the new id", async () => {
      const retypePassword = "Password1";
      const newUser = { name, email, password, retypePassword };
      hashedPassword = await Auth.hashPassword(password);
      mockUserRepository.save.resolves({
        id: 1,
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
      });

      const result = await authService.registerUser(newUser);

      expect(mockUserRepository.save).to.have.been.calledOnce;
      expect(result).to.be.not.null;
      expect(result).to.have.property("id").to.be.equal(1);
      expect(result).to.have.property("name").to.be.equal(name);
      expect(result).to.have.property("email").to.be.equal(email);
    });

    it("should throw HttpError object when user data is null", async () => {
      try {
        await authService.registerUser(null);
      } catch (error) {
        expect(mockUserRepository.save).to.have.been.not.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("User data cannot be empty");
        expect(error.statusCode).to.be.equal(400);
      }
    });
  });

  describe("Login User", () => {
    it("should return a user object with token if email and password are both valid", async () => {
      const token = "fake-token";
      mockUserRepository.findByEmail.resolves({
        id: 1,
        name,
        email,
        password: hashedPassword,
      });
      mockJwtUtils.generateToken.resolves(token);

      const result = await authService.loginUser(email, password);

      expect(result).to.be.not.null;
      expect(result).to.have.property("user");
      expect(result).to.have.property("token").to.be.equal(token);
    });

    it("should throw HttpError object when email does not exist", async () => {
      try {
        await authService.loginUser("fakeemail@example.com", "Password1");
      } catch (error) {
        expect(mockJwtUtils.generateToken).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Invalid email or password");
        expect(error.statusCode).to.be.equal(401);
      }
    });

    it("should throw HttpError object when email or password is invalid", async () => {
      try {
        mockUserRepository.findByEmail.resolves({
          id: 1,
          name,
          email,
          password: hashedPassword,
        });

        await authService.loginUser(email, "bad-password");
      } catch (error) {
        expect(mockJwtUtils.generateToken).to.have.not.been.called;
        expect(error).to.be.instanceOf(HttpError);
        expect(error.message).to.be.equal("Invalid email or password");
        expect(error.statusCode).to.be.equal(401);
      }
    });
  });
});
