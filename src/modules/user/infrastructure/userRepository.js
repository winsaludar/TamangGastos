export class InMemoryUserRepository {
  constructor() {
    this.users = [];
    this.currentId = 1; // To simulate auto-incrementing IDs
  }

  async save(user) {
    if (!user.id) {
      // Create a new user
      user.id = this.currentId++;
    } else {
      // Update an existing user
      const index = this.users.findIndex((u) => u.id === user.id);
      if (index >= 0) this.users[index] = user;
    }

    this.users.push(user);
    return user;
  }

  async findById(id) {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email) {
    return this.users.find((user) => user.email === email) || null;
  }

  async findAll() {
    return this.users;
  }

  async deleteById(id) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index >= 0) {
      const [deletedUser] = this.users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }

  async clear() {
    // Clears all users, useful for testing
    this.users = [];
    this.currentId = 1;
  }
}
