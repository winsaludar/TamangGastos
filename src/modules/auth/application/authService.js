import { Auth } from "../domain/authEntity.js";

export class AuthService {
  constructor(userRepository, jwtUtils) {
    this.userRepository = userRepository;
    this.jwtUtils = jwtUtils;
  }

  async registerUser(userData) {
    const hashedPassword = await Auth.hashPassword(userData.password);
    const newUser = { ...userData, password: hashedPassword };
    return this.userRepository.save(newUser);
  }

  async loginUser(email, password) {
    const errorMessage = "Invalid email or password";

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error(errorMessage);

    const isValidPassword = await Auth.verifyPassword(password, user.password);
    if (!isValidPassword) throw new Error(errorMessage);

    const token = this.jwtUtils.generateToken({
      id: user.id,
      email: user.email,
    });
    return { user, token };
  }
}
