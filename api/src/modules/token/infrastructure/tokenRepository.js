import Token from "../domain/token.js";
import { knexInstance } from "../../../common/config/databaseConfig.js";

export default class TokenRepository {
  constructor() {
    this.tableName = "tokens";
  }

  /**
   * Find user token using their id
   *
   * @param {string} userId - The user_id of the token
   * @param {string} tokenType - The token_type of the token
   * @returns {Token} - The token domain entity or null if not found
   */
  async findByUserId(userId, tokenType) {
    const row = await knexInstance(this.tableName)
      .where({ user_id: userId, token_type: tokenType })
      .andWhere("expires_at", ">", new Date()) // Ensure token is not expired
      .orderBy("expires_at", "desc")
      .first();
    return row ? this.toDomain(row) : null;
  }

  /**
   * Save a new user token to the database
   *
   * @param {Token} token - The token domain entity to save
   * @returns {number} - The id of the saved token
   */
  async save(token) {
    const [id] = await knexInstance(this.tableName)
      .insert({
        user_id: token.userId,
        token: token.token,
        token_type: token.tokenType,
        expires_at: token.expiresAt,
        created_at: token.createdAt,
        updated_at: token.updatedAt,
      })
      .returning("id");

    return id;
  }

  /**
   * Convert a database row to a domain entity.
   *
   * @param {Object} row - The database row object.
   * @returns {Token} - The token domain entity.
   */
  toDomain(row) {
    return Token.create({
      id: row.id,
      userId: row.user_id,
      token: row.token,
      tokenType: row.token_type,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  /**
   * Convert a domain entity to a database row format.
   *
   * @param {Token} token - The token domain entity.
   * @returns {Object} - The database row object.
   */
  toDatabase(token) {
    return {
      id: token.id,
      user_id: token.userId,
      token: token.token,
      token_type: token.tokenType,
      expires_at: token.expiresAt,
      created_at: token.createdAt,
      updated_at: token.updatedAt,
    };
  }
}
