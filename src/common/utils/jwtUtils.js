export default class JwtUtils {
  constructor(jwt) {
    this.jwt = jwt;
  }

  generateToken(payload) {
    return this.jwt.sign(payload, { expiresIn: "1h" });
  }

  verifyToken(token) {
    return this.jwt.verify(token);
  }
}
