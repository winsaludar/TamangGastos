import Auth from "../domain/auth.js";
import HttpError from "../../../common/errors/httpError.js";

export default class AuthService {
  constructor(userRepository, jwtUtils) {
    this.userRepository = userRepository;
    this.jwtUtils = jwtUtils;
  }

  async registerUser(userData) {
    const hashedPassword = await Auth.hashPassword(userData.password);
    const newUser = { ...userData, password: hashedPassword };
    this.userRepository.save(newUser);

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  async loginUser(email, password) {
    const errorMessage = "Invalid email or password";

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new HttpError(errorMessage, 401);

    const isValidPassword = await Auth.verifyPassword(password, user.password);
    if (!isValidPassword) throw new HttpError(errorMessage, 401);

    const token = this.jwtUtils.generateToken({
      id: user.id,
      email: user.email,

      // Add additional custom claims here...
    });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async forgotPassword(email) {
    // TODO
  }

  async verifyEmail(email, otp) {
    // TODO
  }
}
