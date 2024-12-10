import { emailConfig } from "../config/config.js";
import nodemailer from "nodemailer";

export default class EmailUtils {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtpServer,
      port: emailConfig.smtpPort,
      secure: false,
      auth: {
        user: emailConfig.smtpLogin,
        pass: emailConfig.smtpPassword,
      },
    });
  }

  /**
   * Send and email to the user
   *
   * @param {string} toEmail Email of the recipient
   * @param {string} subject Subject of the email
   * @param {string} htmlContent Body of the email in HTML format
   */
  async sendEmail(toEmail, subject, htmlContent) {
    const mailOptions = {
      from: emailConfig.fromEmail,
      to: toEmail,
      subject,
      html: htmlContent,
    };

    this.transporter.sendMail(mailOptions);
  }
}
