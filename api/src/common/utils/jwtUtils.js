import { jwtConfig } from "../config/config.js";

export default class JwtUtils {
  constructor(jwt) {
    this.jwt = jwt;
  }

  generateToken(payload) {
    return this.jwt.sign(payload, { expiresIn: jwtConfig.expiresIn });
  }

  verifyToken(token) {
    return this.jwt.verify(token);
  }
}
