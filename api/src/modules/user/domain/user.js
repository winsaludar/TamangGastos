export default class User {
  // Private static field to track instance creation
  static #allowConstructor = false;

  constructor({
    id,
    username,
    email,
    passwordHash,
    firstName,
    lastName,
    isActive,
    createdAt,
    updatedAt,
  }) {
    if (!User.#allowConstructor)
      throw new Error("Use 'User.create()' to instantiate this class");

    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({
    id,
    username,
    email,
    passwordHash,
    firstName,
    lastName,
    isActive,
    createdAt,
    updatedAt,
  }) {
    User.#allowConstructor = true;

    if (!username || username.trim().length <= 0)
      throw new Error("Username cannot be empty");

    if (!email || email.trim().length <= 0)
      throw new Error("Email cannot be empty");

    if (!passwordHash || passwordHash.trim().length <= 0)
      throw new Error("PasswordHash cannot be empty");

    const newUser = new User({
      id: id ?? null,
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      isActive: isActive ?? true,
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? new Date(),
    });

    User.#allowConstructor = false;

    return newUser;
  }

  getId() {
    return this.id;
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  updateProfile({ firstName, lastName, email }) {
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (email) this.email = email;

    this.updatedAt = new Date();
  }

  getFullName() {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }
}
