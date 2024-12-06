import JwtUtils from "../../../common/utils/jwtUtils.js";
import { AuthService } from "../application/authService.js";
import { InMemoryUserRepository } from "../../user/infrastructure/userRepository.js";

export default async function authRoutes(fastify, options) {
  const jwtUtils = new JwtUtils(fastify.jwt);
  const authService = new AuthService(new InMemoryUserRepository(), jwtUtils);

  fastify.post("/register", async (request, reply) => {
    const user = await authService.registerUser(request.body);
    reply.send({ message: "User registered successfully", user });
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;
    const { user, token } = await authService.loginUser(email, password);
    reply.send({ user, token });
  });
}
