export const okSchema = {
  description: "Successful response",
  type: "object",
  properties: {
    message: { type: "string" },
    status: { stype: "integer" },
    data: { type: "object" },
  },
};

export const badRequestSchema = {
  description: "Bad request response",
  type: "object",
  properties: { message: { type: "string" }, details: { type: "array" } },
};

export const internalServerErrorSchema = {
  description: "Internal server error response",
  type: "object",
  properties: { message: { type: "string" } },
};
