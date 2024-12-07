import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../common/schemas/responseSchema.js";
import {
  loginRequestSchema,
  loginResponseSchema,
} from "./schemas/loginSchema.js";
import {
  registerRequestSchema,
  registerResponseSchema,
} from "./schemas/registerSchema.js";

const registerMetadata = {
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

const loginMetadata = {
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

export default async function authRoutes(fastify, options) {
  fastify.post("/register", registerMetadata, async (request, reply) => {
    const user = await fastify.authService.registerUser(request.body);
    reply.send({
      message: "Register successful",
      status: 200,
      data: { user },
    });
  });

  fastify.post("/login", loginMetadata, async (request, reply) => {
    const { email, password } = request.body;
    const { user, token } = await fastify.authService.loginUser(
      email,
      password
    );
    reply.send({
      message: "Login successful",
      status: 200,
      data: { user, token },
    });
  });
}
