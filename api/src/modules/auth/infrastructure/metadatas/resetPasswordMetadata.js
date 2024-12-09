import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
} from "../schemas/resetPasswordSchemas.js";

export const resetPasswordMetadata = {
  schema: {
    description: "Reset password",
    response: {
      200: resetPasswordResponseSchema,
      400: badRequestSchema,
      500: internalServerErrorSchema,
    },
    body: resetPasswordRequestSchema,
  },
};
