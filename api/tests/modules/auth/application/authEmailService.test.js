import * as chai from "chai";

import AuthEmailService from "../../../../src/modules/auth/application/authEmailService.js";
import EmailUtils from "../../../../src/common/utils/emailUtils.js";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
const { expect } = chai;

describe("Auth Email Service", () => {
  const email = "test-email@example.com";
  const token = "test-token";
  const name = "test-name";

  let mockEmailUtils;
  let authEmailService;

  beforeEach(() => {
    mockEmailUtils = sinon.createStubInstance(EmailUtils);
    authEmailService = new AuthEmailService(mockEmailUtils);
  });

  describe("Send Email Confirmation", () => {
    it("should send an email confirmation", async () => {
      // Arrange
      mockEmailUtils.sendEmail.resolves();

      // Act
      await authEmailService.sendEmailConfirmation(email, token, name);

      // Assert
      expect(mockEmailUtils.sendEmail.calledOnce).to.be.true;
    });
  });

  describe("Send Forgot Password", () => {
    it("should send a forgot password email", async () => {
      // Arrange
      mockEmailUtils.sendEmail.resolves();

      // Act
      await authEmailService.sendForgotPasswordUrl(email, token, name);

      // Assert
      expect(mockEmailUtils.sendEmail.calledOnce).to.be.true;
    });
  });
});
