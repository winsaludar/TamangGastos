import { authMiddleware } from "../../../common/middlewares/authMiddleware.js";

export default async function userRoutes(fastify, options) {
  fastify.get(
    "/users",
    { preHandler: authMiddleware },
    async (request, reply) => {
      return [{ id: 1, name: "John Doe" }];
    }
  );
}
