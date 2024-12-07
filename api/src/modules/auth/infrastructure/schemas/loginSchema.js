import { okSchema } from "../../../../common/schemas/responseSchema.js";

export const loginRequestSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 1,
      errorMessage: {
        format: "Invalid email format",
        minLength: "Email cannot be empty",
      },
    },
    password: {
      type: "string",
      minLength: 1,
      errorMessage: { minLength: "Password cannot be empty" },
    },
  },
  required: ["email", "password"],
  errorMessage: {
    required: {
      email: "Email property is required",
      password: "Password property is required",
    },
  },
  additionalProperties: false,

  // Custom error messages
  errorMessage: {
    required: {
      email: "Email cannot be empty",
      password: "Password cannot be empty",
    },
    properties: {
      email: "Email format is invalid",
      password: "Password should be at least 6 characters long",
    },
  },
};

export const loginResponseSchema = {
  ...okSchema,
  properties: {
    ...okSchema.properties,
    data: {
      user: { ref: "#userSchema" },
      token: { type: "string" },
    },
  },
};
