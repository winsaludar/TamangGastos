import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  registerRequestSchema,
  registerResponseSchema,
} from "../schemas/registerSchemas.js";

export const registerMetadata = {
  schema: {
    description: "Register user",
    response: {
      200: registerResponseSchema,
      400: badRequestSchema,
      500: internalServerErrorSchema,
    },
    body: registerRequestSchema,
  },
};
