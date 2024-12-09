export default class Token {
  static #allowConstructor = false;

  constructor({
    id,
    userId,
    token,
    tokenType,
    expiresAt,
    createdAt,
    updatedAt,
  }) {
    if (!Token.#allowConstructor)
      throw new Error("Use 'Token.create()' to instantiate this class");

    this.id = id;
    this.userId = userId;
    this.token = token;
    this.tokenType = tokenType;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({
    id,
    userId,
    token,
    tokenType,
    expiresAt,
    createdAt,
    updatedAt,
  }) {
    Token.#allowConstructor = true;

    if (!userId) throw new Error("UserId cannot be empty");

    if (!token || token.trim().length <= 0)
      throw new Error("Token cannot be empty");

    if (!tokenType || tokenType.trim().length <= 0)
      throw new Error("TokenType cannot be empty");

    if (!expiresAt) throw new Error("ExpiresAt cannot be empty");

    const newToken = new Token({
      id: id ?? null,
      userId,
      token,
      tokenType,
      expiresAt,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date(),
    });

    Token.#allowConstructor = false;

    return newToken;
  }

  getToken() {
    return this.token;
  }

  getExpiresAt() {
    return this.expiresAt;
  }

  getTokenType() {
    return this.tokenType;
  }
}
