import { forgotPasswordMetadata } from "./metadatas/forgotPasswordMetadata.js";
import { loginMetadata } from "./metadatas/loginMetadata.js";
import { registerMetadata } from "./metadatas/registerMetadata.js";
import { resetPasswordMetadata } from "./metadatas/resetPasswordMetadata.js";

export default async function authRoutes(fastify, options) {
  fastify.post("/register", registerMetadata, async (request, reply) => {
    const { username, email, password } = request.body;
    const user = await fastify.authService.registerUser(
      username,
      email,
      password
    );
    reply.send({
      message: "Register successful",
      status: 200,
      data: { user },
    });
  });

  fastify.post("/login", loginMetadata, async (request, reply) => {
    const { email, password } = request.body;
    const { user, token } = await fastify.authService.loginUser(
      email,
      password
    );
    reply.send({
      message: "Login successful",
      status: 200,
      data: { user, token },
    });
  });

  fastify.post(
    "/forgot-password",
    forgotPasswordMetadata,
    async (request, reply) => {
      const { email } = request.body;
      const { user, token } = await fastify.authService.forgotPassword(email);
      reply.send({
        message: "If the email exists, a reset link will be sent",
        status: 200,
        data: { user, token },
      });
    }
  );

  fastify.post(
    "/reset-password",
    resetPasswordMetadata,
    async (request, reply) => {
      const { email, password, token } = request.body;
      await fastify.authService.resetPassword(email, password, token);
      reply.send({
        message: "Reset password successful",
        status: 200,
      });
    }
  );
}
