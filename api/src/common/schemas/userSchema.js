export const userSchema = {
  $id: "#userSchema",
  type: "object",
  properties: {
    id: { type: "integer" },
    username: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["id", "username", "email"],
  additionalProperties: false,
};
