import { okSchema } from "../../../../common/schemas/responseSchema.js";

export const validateEmailRequestSchema = {
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
    token: {
      type: "string",
      minLength: 1,
      errorMessage: { minLength: "Token cannot be empty" },
    },
  },
  required: ["email", "token"],
  errorMessage: {
    required: {
      email: "Email property is required",
      token: "Token property is required",
    },
  },
  additionalProperties: false,
};

export const validateEmailResponseSchema = {
  ...okSchema,
  properties: {
    ...okSchema.properties,
  },
};
