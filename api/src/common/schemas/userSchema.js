export const userSchema = {
  $id: "#userSchema",
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["id", "name", "email"],
  additionalProperties: false,
};
