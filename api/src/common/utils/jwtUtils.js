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

  getTokenExpiry(token) {
    const decoded = this.verifyToken(token);

    // The 'exp' claim represents the expiry time (in seconds since the epoch)
    // Convert to milliseconds for easier comparison
    return decoded.exp * 1000;
  }
}
