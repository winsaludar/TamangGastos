import { okSchema } from "../../../../common/schemas/responseSchema.js";

export const resendEmailConfirmationRequestSchema = {
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
};

export const resendEmailConfirmationResponseSchema = {
  ...okSchema,
  properties: {
    ...okSchema.properties,
  },
};
