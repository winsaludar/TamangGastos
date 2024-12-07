export const registerHooks = (fastify) => {
  fastify.addHook("onRequest", async (request, reply) => {
    try {
      const excludePaths = /^\/(api\/auth|docs)/; // Exclude /api/auth and /docs from authenticating
      if (excludePaths.test(request.url)) return;

      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
};
