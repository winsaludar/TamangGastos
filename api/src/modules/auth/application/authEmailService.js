import { appConfig, emailConfig } from "../../../common/config/config.js";

import fs from "fs";
import path from "path";

export default class AuthEmailService {
  constructor(emailUtils) {
    this.emailUtils = emailUtils;
  }

  async sendEmailConfirmation(email, token, name) {
    try {
      const confirmEmailUrl = `${appConfig.baseUrl}/${appConfig.confirmEmailUrl}?email=${email}&token=${token}`;
      const emailSubject = emailConfig.emailConfirmationSubject;
      const templatePath = path.resolve(
        "../templates",
        "email-confirmation.html"
      );
      const emailBody = generateEmailTemplate(
        name,
        confirmEmailUrl,
        emailConfig.fromEmail,
        emailConfig.fromName,
        templatePath
      );

      await this.emailUtils.sendEmail(email, emailSubject, emailBody);
    } catch (error) {
      console.log("Send Error", error);
      // TODO: Add retry policy
      // TODO: Log error
    }
  }

  async sendForgotPasswordUrl(email, token, name) {
    try {
      const forgotPasswordUrl = `${appConfig.baseUrl}/${appConfig.forgotPasswordUrl}?email=${email}&token=${token}`;
      const emailSubject = emailConfig.forgotPasswordSubject;
      const templatePath = path.resolve("../templates", "forgot-password.html");
      const emailBody = generateEmailTemplate(
        name,
        forgotPasswordUrl,
        emailConfig.fromEmail,
        emailConfig.fromName,
        templatePath
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
 *
 * @param {string} username The username of the new user
 * @param {string} link The link where the user will be redirected
 * @param {string} fromEmail The email of the sender (app email)
 * @param {string} fromName The name of the sender (app name)
 * @param {string} templatePath The path of the template file
 * @returns {string} Email body content in HTML format
 */
function generateEmailTemplate(
  username,
  link,
  fromEmail,
  fromName,
  templatePath
) {
  const template = fs.readFileSync(templatePath, "utf-8");

  return template
    .replace("{{username}}", username)
    .replace("{{link}}", link)
    .replace("{{fromEmail}}", fromEmail)
    .replace("{{fromName}}", fromName);
}
