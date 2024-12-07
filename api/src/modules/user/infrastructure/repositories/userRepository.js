import User from "../../domain/user.js";
import { knexInstance } from "../../../../common/config/databaseConfig.js";

export default class UserRepository {
  constructor() {
    this.tableName = "user_accounts";
  }

  /**
   * Find a user by their username or email
   *
   * @param {string} username - The username of the user
   * @param {string} email - The email of the user
   * @returns {User | null} - The user domain entity or null if not found
   */
  async findByUsernameOrEmail(username, email) {
    const row = await knexInstance(this.tableName)
      .whereRaw("LOWER(username) = LOWER(?)", [username]) // Safe parameterized query
      .orWhereRaw("LOWER(email) = LOWER(?)", [email]) // Safe parameterized query
      .first();

    return row ? this.toDomain(row) : null;
  }

  /**
   * Save a new user to the database
   *
   * @param {User} user - The user domain entity to save
   * @returns {number} - The id of the saved user
   */
  async save(user) {
    const {
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      isActive,
      createdAt,
      updatedAt,
    } = user;

    const [id] = await knexInstance(this.tableName)
      .insert({
        username,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        is_active: isActive,
        created_at: createdAt,
        updated_at: updatedAt,
      })
      .returning("id");

    return id;
  }

  /**
   * Convert a database row to a domain entity.
   *
   * @param {Object} row - The database row object.
   * @returns {User} - The user domain entity.
   */
  toDomain(row) {
    return User.create({
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      firstName: row.first_name,
      lastName: row.last_name,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  /**
   * Convert a domain entity to a database row format.
   *
   * @param {User} user - The user domain entity.
   * @returns {Object} - The database row object.
   */
  toDatabase(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password_hash: user.passwordHash,
      first_name: user.firstName,
      last_name: user.lastName,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
