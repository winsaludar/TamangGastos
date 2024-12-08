import nodemailer from "nodemailer";

export default class EmailUtils {
  constructor(emailConfig) {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtpServer,
      port: emailConfig.smtpPort,
      secure: false,
      auth: {
        user: emailConfig.smtpLogin,
        pass: emailConfig.smtpPassword,
      },
    });

    this.emailConfig = emailConfig;
  }

  async sendEmail(toEmail, toName, subject, htmlContent) {
    const mailOptions = {
      from: this.emailConfig.fromEmail,
      to: toEmail,
      subject,
      html: htmlContent,
    };

    this.transporter.sendMail(mailOptions);
  }

  getFromEmail() {
    return this.emailConfig.fromEmail;
  }

  getFromName() {
    return this.emailConfig.fromName;
  }

  getEmailConfirmationSubject() {
    return this.emailConfig.emailConfirmationSubject;
  }

  getEmailConfirmedSubject() {
    return this.emailConfig.emailConfirmedSubject;
  }
}
