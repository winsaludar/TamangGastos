export default class User {
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
    return new User({
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
