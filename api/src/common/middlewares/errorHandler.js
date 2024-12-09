import HttpError from "../errors/httpError.js";

export default function errorHandler(error, request, reply) {
  if (error.validation) {
    reply.status(error.statusCode).send({
      message: "Invalid input",
      details: error.validation
        .filter((x) => x.keyword !== "if") // remove default error message from custom validation in the schema
        .map((x) => x.message),
    });
  } else if (error instanceof HttpError) {
    console.log(error);
    reply.status(error.statusCode).send({ message: error.message });
  } else {
    // TODO: log error
    console.log(error);
    reply.status(500).send({ message: "Internal server error" });
  }
}
