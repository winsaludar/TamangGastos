import { appConfig } from "../../../common/config/config.js";
import fs from "fs";
import path from "path";

export default class AuthEmailService {
  constructor(emailUtils) {
    this.emailUtils = emailUtils;
  }

  async sendEmailConfirmation(email, token, name) {
    try {
      const confirmEmailUrl = `${appConfig.baseUrl}/${appConfig.confirmEmailUrl}?email=${email}&token=${token}`;
      const emailSubject = this.emailUtils.getEmailConfirmationSubject();
      const emailBody = generateEmailConfirmationTemplate(
        name,
        confirmEmailUrl,
        this.emailUtils.getFromEmail(),
        this.emailUtils.getFromName()
      );

      await this.emailUtils.sendEmail(email, emailSubject, emailBody);
    } catch (error) {
      console.log("Send Error", error);
      // TODO: Add retry policy
      // TODO: Log error
    }
  }
}

/**
 * PRIVATE FUNCTIONS
 */

function generateEmailConfirmationTemplate(
  username,
  confirmationLink,
  fromEmail,
  fromName
) {
  const filePath = path.resolve("../templates", "email-confirmation.html");
  const template = fs.readFileSync(filePath, "utf-8");

  return template
    .replace("{{username}}", username)
    .replace("{{confirmationLink}}", confirmationLink)
    .replace("{{fromEmail}}", fromEmail)
    .replace("{{fromName}}", fromName);
}
