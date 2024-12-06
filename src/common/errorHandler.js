export default function errorHandler(error, request, reply) {
  if (error.validation) {
    reply.status(400).send({
      message: "Invalid input",
      details: error.validation
        .filter((x) => x.keyword !== "if") // remove default error message from custom validation in the schema
        .map((x) => x.message),
    });
  } else if (error.statusCode === 401) {
    reply.status(401).send({ message: error.message });
  } else {
    // TODO: log error
    console.log(error);
    reply.status(500).send({ message: "Internal server error" });
  }
}
