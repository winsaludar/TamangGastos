import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  baseUrl: process.env.APP_BASE_URL,
  confirmEmailUrl: process.env.APP_CONFIRM_EMAIL_URL,
  forgotPasswordUrl: process.env.APP_FORGOT_PASSWORD_URL,
};

export const corsConfig = {
  allowedOrigins: process.env.CORS_ALLOWED_ORIGINS,
  allowedMethods: process.env.CORS_ALLOWED_METHODS,
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
  allowCredentials: process.env.CORS_ALLOW_CREDENTIALS,
  maxAge: process.env.CORS_MAX_AGE,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  forgotPasswordTokenExpiresIn: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRY,
  confirmEmailTokenExpiresIn: process.env.JWT_CONFIRM_EMAIL_TOKEN_EXPIRY,
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
  forgotPasswordSubject: process.env.FORGOT_PASSWORD_SUBJECT,
};
