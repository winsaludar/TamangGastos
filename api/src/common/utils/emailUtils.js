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
