export default class Token {
  constructor({
    id,
    userId,
    token,
    tokenType,
    expiresAt,
    createdAt,
    updatedAt,
  }) {
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
    return new Token({
      id: id ?? null,
      userId,
      token,
      tokenType,
      expiresAt,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date(),
    });
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
