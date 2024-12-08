import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1h",
};

export const dbConfig = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  databaseName: process.env.DB_DATABASE_NAME,
};

export const emailConfig = {
  apiKey: process.env.BREVO_API_KEY,
  smtpServer: process.env.SMTP_SERVER,
  smtpPort: process.env.SMTP_PORT,
  smtpLogin: process.env.SMTP_LOGIN,
  smtpPassword: process.env.SMTP_PASSWORD,
  fromEmail: process.env.SMTP_SENDER_FROM_EMAIL,
  fromName: process.env.SMTP_SENDER_FROM_NAME,
  emailConfirmationSubject: process.env.REGISTRATION_EMAIL_CONFIRMATION_SUBJECT,
  emailConfirmedSubject: process.env.REGISTRATION_EMAIL_CONFIRMED_SUBJECT,
};
