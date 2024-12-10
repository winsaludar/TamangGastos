import HttpError from "../errors/httpError.js";

/**
 * Exception handling middleware that runs before sending the response/reply to the user
 *
 * @param {Error} error The error object thrown by the application
 * @param {_Request} request The fastify request object
 * @param {_Reply} reply The fastify reply object
 */
export default function errorHandler(error, request, reply) {
  if (error.validation) {
    reply.status(error.statusCode).send({
      message: "Invalid input",
      statusCode: error.statusCode,
      details: error.validation
        .filter((x) => x.keyword !== "if") // remove default error message from custom validation in the schema
        .map((x) => x.message),
    });
  } else if (error instanceof HttpError) {
    console.log(error);
    reply
      .status(error.statusCode)
      .send({ message: error.message, statusCode: error.statusCode });
  } else {
    // TODO: log error
    console.log(error);
    reply
      .status(500)
      .send({ message: "Internal server error", statusCode: 500 });
  }
}
