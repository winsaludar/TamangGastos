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

import AuthService from "../application/authService.js";
import InMemoryUserRepository from "../../user/infrastructure/repositories/userRepository.js";
import JwtUtils from "../../../common/utils/jwtUtils.js";

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
  const jwtUtils = new JwtUtils(fastify.jwt);
  const authService = new AuthService(new InMemoryUserRepository(), jwtUtils);

  fastify.post("/register", registerMetadata, async (request, reply) => {
    const user = await authService.registerUser(request.body);
    reply.send({
      message: "Register successful",
      status: 200,
      data: { user },
    });
  });

  fastify.post("/login", loginMetadata, async (request, reply) => {
    const { email, password } = request.body;
    const { user, token } = await authService.loginUser(email, password);
    reply.send({
      message: "Login successful",
      status: 200,
      data: { user, token },
    });
  });
}
