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
