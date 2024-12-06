import Fastify from "fastify";
import fastifyJwt from "fastify-jwt";
import authRoutes from "./modules/auth/infrastructure/authRoutes.js";
import userRoutes from "./modules/user/infrastructure/userRoutes.js";

export async function createApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register JWT plugin
  fastify.register(fastifyJwt, { secret: "your_jwt_secret" });

  // Import routes here...
  fastify.register(authRoutes, { prefix: "/api/auth" });
  fastify.register(userRoutes, { prefix: "/api/users" });

  return fastify;
}
