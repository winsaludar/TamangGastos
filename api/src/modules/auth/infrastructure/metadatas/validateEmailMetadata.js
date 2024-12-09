import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  validateEmailRequestSchema,
  validateEmailResponseSchema,
} from "../schemas/validateEmailSchemas.js";

export const validateEmailMetadata = {
  schema: {
    description: "Validate email",
    response: {
      200: validateEmailResponseSchema,
      400: badRequestSchema,
      500: internalServerErrorSchema,
    },
    body: validateEmailRequestSchema,
  },
};
