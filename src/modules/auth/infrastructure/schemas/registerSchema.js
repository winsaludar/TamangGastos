import { okSchema } from "../../../../common/schemas/responseSchema.js";
import { userSchema } from "../../../../common/schemas/userSchema.js";

export const registerRequestSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
    retypePassword: { type: "string" },
  },
  required: ["name", "email", "password", "retypePassword"],
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

  // Custom error messages
  errorMessage: {
    required: {
      name: "Name cannot be empty",
      email: "Email cannot be empty",
      password: "Password cannot be empty",
      retypePassword: "Re-type password cannot be empty",
    },
    properties: {
      password: "Password should be at least 6 characters long",
    },
  },
};

export const registerResponseSchema = {
  ...okSchema,
  properties: {
    ...okSchema.properties,
    data: {
      user: { ref: "#/components/schemas/user" },
    },
  },
  components: {
    schemas: {
      user: userSchema,
    },
  },
};
