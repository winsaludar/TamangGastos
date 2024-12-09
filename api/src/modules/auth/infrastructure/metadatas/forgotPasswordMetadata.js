import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  forgotPasswordRequestSchema,
  forgotPasswordResponseSchema,
} from "../schemas/forgotPasswordSchemas.js";

export const forgotPasswordMetadata = {
  schema: {
    description: "Forgot password",
    response: {
      200: forgotPasswordResponseSchema,
      400: badRequestSchema,
      500: internalServerErrorSchema,
    },
    body: forgotPasswordRequestSchema,
  },
};
