import { okSchema } from "../../../../common/schemas/responseSchema.js";

export const resetPasswordRequestSchema = {
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
      minLength: 6,
      errorMessage: {
        minLength: "Password must be at least 6 characters long",
      },
    },
    retypePassword: {
      type: "string",
      minLength: 1,
      errorMessage: { minLength: "Re-type Password cannot be empty" },
    },
    token: {
      type: "string",
      minLength: 1,
      errorMessage: { minLength: "Token cannot be empty" },
    },
  },
  required: ["email", "password", "retypePassword", "token"],
  errorMessage: {
    required: {
      email: "Email property is required",
      password: "Password property is required",
      retypePassword: "Re-type Password property is required",
      token: "Token property is required",
    },
  },
  additionalProperties: false,

  // Custom validation for password comparison
  if: {
    properties: { password: { type: "string" } },
  },
  then: {
    properties: {
      retypePassword: {
        const: { $data: "1/password" }, // Compare password & retypePassword
        errorMessage: "Passwords does not match",
      },
    },
  },
};

export const resetPasswordResponseSchema = {
  ...okSchema,
  properties: {
    ...okSchema.properties,
  },
};
