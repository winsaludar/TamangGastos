import AuthService from "./modules/auth/application/authService.js";
import Fastify from "fastify";
import JwtUtils from "./common/utils/jwtUtils.js";
import TokenRepository from "./modules/token/infrastructure/tokenRepository.js";
import UserRepository from "./modules/user/infrastructure/userRepository.js";
import ajvErrors from "ajv-errors";
import authRoutes from "./modules/auth/infrastructure/authRoutes.js";
import errorHandler from "./common/middlewares/errorHandler.js";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { jwtConfig } from "./common/config/config.js";
import { registerHooks } from "./common/middlewares/hooks.js";
import { swaggerOptions } from "./common/config/swagger.js";

export async function createApp(callback) {
  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        allErrors: true,
        $data: true,
      },
      plugins: [ajvErrors],
    },
  });

  // Register custom error handler (must be at the top)
  fastify.setErrorHandler(errorHandler);

  // Register JWT plugin
  await fastify.register(fastifyJwt, { secret: jwtConfig.secret });

  // Register swagger
  await fastify.register(fastifySwagger);
  await fastify.register(fastifySwaggerUi, swaggerOptions);

  // Register api routes
  await fastify.register(authRoutes, { prefix: "/api/auth" });

  // Register global hooks
  registerHooks(fastify);

  // Register services as fastify decoration.
  // We use callback so we can inject mock services from unit tests
  if (callback) {
    callback(fastify);
  } else {
    registerServices(fastify);
  }

  return fastify;
}

async function registerServices(fastify) {
  fastify.decorate(
    "authService",
    new AuthService(
      new UserRepository(),
      new TokenRepository(),
      new JwtUtils(fastify.jwt)
    )
  );
}
