import { createApp } from "./app.js";

const startServer = async () => {
  const fastify = await createApp();

  try {
    fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }

      fastify.log.info(`Server running at ${address}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit();
  }
};

startServer();
