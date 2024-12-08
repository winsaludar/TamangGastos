import fs from "fs";
import path from "path";

export default class AuthEmailService {
  constructor(emailUtils) {
    this.emailUtils = emailUtils;
  }

  async sendEmailConfirmation(email, name) {
    try {
      const emailSubject = this.emailUtils.getEmailConfirmationSubject();
      const emailBody = generateEmailConfirmationTemplate(
        name,
        "",
        this.emailUtils.getFromEmail(),
        this.emailUtils.getFromName()
      );

      await this.emailUtils.sendEmail(email, name, emailSubject, emailBody);
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
