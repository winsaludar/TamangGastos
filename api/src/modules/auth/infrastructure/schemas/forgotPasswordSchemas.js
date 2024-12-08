import { okSchema } from "../../../../common/schemas/responseSchema.js";

export const forgotPasswordRequestSchema = {
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
  },
  required: ["email"],
  errorMessage: {
    required: {
      email: "Email property is required",
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
    },
  },
};

export const forgotPasswordResponseSchema = {
  ...okSchema,
  properties: {
    ...okSchema.properties,
    data: {
      user: { ref: "#userSchema" },
      token: { type: "string" },
    },
  },
};
