import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

// Import routes here...
//fastify.register();

// Run the server
const start = async () => {
  try {
    fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }

      fastify.log.info(`server listening on ${address}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit();
  }
};
start();
