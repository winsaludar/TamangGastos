import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  loginRequestSchema,
  loginResponseSchema,
} from "../schemas/loginSchemas.js";

export const loginMetadata = {
  schema: {
    description: "Login user",
    response: {
      200: loginResponseSchema,
      400: badRequestSchema,
      500: internalServerErrorSchema,
    },
    body: loginRequestSchema,
  },
};
