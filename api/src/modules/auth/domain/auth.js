import bcrypt from "bcrypt";

export default class Auth {
  constructor() {
    throw new Error("Auth class cannot be instantiated");
  }

  /**
   * Hash password using bcrypt
   *
   * @param {string} password The password (in plain) to be hashed
   * @returns {Promise<string>} The hashed password
   */
  static async hashPassword(password) {
    if (!password || password.length <= 0)
      throw new Error("Password cannot be empty");

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify password
   *
   * @param {string} password The password (in plain) to be verified
   * @param {string} hashPassword The password (in hash) used for verification
   * @returns {Promise<boolean>} True or false wether the passwords match
   */
  static async verifyPassword(password, hashPassword) {
    if (!password || password.length <= 0)
      throw new Error("Password cannot be empty");

    if (!hashPassword || hashPassword.length <= 0)
      throw new Error("Hash password cannot be empty");

    return bcrypt.compare(password, hashPassword);
  }
}
