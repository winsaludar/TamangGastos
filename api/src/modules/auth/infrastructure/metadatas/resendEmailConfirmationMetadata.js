import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  resendEmailConfirmationRequestSchema,
  resendEmailConfirmationResponseSchema,
} from "../schemas/resendEmailConfirmationSchemas.js";

export const resendEmailConfirmationMetadata = {
  schema: {
    description: "Resend email confirmation link",
    response: {
      200: resendEmailConfirmationResponseSchema,
      400: badRequestSchema,
      500: internalServerErrorSchema,
    },
    body: resendEmailConfirmationRequestSchema,
  },
};
