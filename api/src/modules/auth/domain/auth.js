import bcrypt from "bcrypt";

export default class Auth {
  static async hashPassword(password) {
    if (!password || password.length <= 0)
      throw new Error("Password cannot be empty");

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password, hashPassword) {
    if (!password || password.length <= 0)
      throw new Error("Password cannot be empty");

    if (!hashPassword || hashPassword.length <= 0)
      throw new Error("Hash password cannot be empty");

    return bcrypt.compare(password, hashPassword);
  }
}
