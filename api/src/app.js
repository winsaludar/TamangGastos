import AuthEmailService from "./modules/auth/application/authEmailService.js";
import AuthService from "./modules/auth/application/authService.js";
import EmailUtils from "./common/utils/emailUtils.js";
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

export async function createApp() {
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
  registerServices(fastify);

  return fastify;
}

async function registerServices(fastify) {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();
  const jwtUtils = new JwtUtils(fastify.jwt);
  const emailUtils = new EmailUtils();
  const authEmailService = new AuthEmailService(emailUtils);
  const authService = new AuthService(
    userRepository,
    tokenRepository,
    jwtUtils,
    authEmailService
  );

  fastify.decorate("userRepository", userRepository);
  fastify.decorate("tokenRepository", tokenRepository);
  fastify.decorate("jwtUtils", jwtUtils);
  fastify.decorate("emailUtils", emailUtils);
  fastify.decorate("authEmailService", authEmailService);
  fastify.decorate("authService", authService);
}
