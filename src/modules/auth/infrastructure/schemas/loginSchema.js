import { okSchema } from "../../../../common/schemas/responseSchema.js";
import { userSchema } from "../../../../common/schemas/userSchema.js";

export const loginRequestSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
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
      user: { ref: "#/components/schemas/user" },
      token: { type: "string" },
    },
  },
  components: {
    schemas: {
      user: userSchema,
    },
  },
};
