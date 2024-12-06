import {
  badRequestSchema,
  internalServerErrorSchema,
} from "../../../../common/schemas/responseSchema.js";
import {
  loginRequestSchema,
  loginResponseSchema,
} from "../schemas/loginSchema.js";
import {
  registerRequestSchema,
  registerResponseSchema,
} from "../schemas/registerSchema.js";

import AuthService from "../../application/authService.js";
import InMemoryUserRepository from "../../../user/infrastructure/repositories/userRepository.js";
import JwtUtils from "../../../../common/utils/jwtUtils.js";

export default async function authRoutes(fastify, options) {
  const jwtUtils = new JwtUtils(fastify.jwt);
  const authService = new AuthService(new InMemoryUserRepository(), jwtUtils);

  fastify.post(
    "/register",
    {
      schema: {
        description: "Register user",
        response: {
          200: registerResponseSchema,
          400: badRequestSchema,
          500: internalServerErrorSchema,
        },
        body: registerRequestSchema,
      },
    },
    async (request, reply) => {
      const user = await authService.registerUser(request.body);
      reply.send({
        message: "Register successful",
        data: { user },
      });
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        description: "Login user",
        response: {
          200: loginResponseSchema,
          400: badRequestSchema,
          500: internalServerErrorSchema,
        },
        body: loginRequestSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const { user, token } = await authService.loginUser(email, password);
      reply.send({ message: "Login successful", data: { user, token } });
    }
  );
}
