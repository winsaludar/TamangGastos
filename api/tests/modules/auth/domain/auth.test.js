import Auth from "../../../../src/modules/auth/domain/auth.js";
import { expect } from "chai";

describe("Auth", () => {
  let hashPassword;

  describe("Hash Password", () => {
    it("should return a hash string from a given password", async () => {
      const password = "Password1";
      hashPassword = await Auth.hashPassword(password);

      expect(hashPassword).to.be.of.string;
      expect(hashPassword).to.be.not.empty;
      expect(hashPassword).to.be.not.null;
      expect(hashPassword).to.be.not.undefined;
    });

    it("should throw an error object when given an empty password", async () => {
      try {
        await Auth.hashPassword("");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.be.equal("Password cannot be empty");
      }
    });
  });

  describe("Verify Password", () => {
    it("should return true when given password matches the hashPassword", async () => {
      const givenPassword = "Password1";
      const didMatch = await Auth.verifyPassword(givenPassword, hashPassword);

      expect(didMatch).to.be.true;
    });

    it("should return false when given password did not match the hashPassword", async () => {
      const givenPassword = "BadPasswor1";
      const didMatch = await Auth.verifyPassword(givenPassword, hashPassword);

      expect(didMatch).to.be.false;
    });

    it("should throw an error object when given an empty password", async () => {
      try {
        await Auth.verifyPassword("", hashPassword);
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.be.equal("Password cannot be empty");
      }
    });

    it("should throw an error object when given an empty hash password", async () => {
      try {
        await Auth.verifyPassword("Password1", "");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.be.equal("Hash password cannot be empty");
      }
    });
  });
});
