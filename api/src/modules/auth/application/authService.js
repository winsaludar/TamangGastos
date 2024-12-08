import Auth from "../domain/auth.js";
import HttpError from "../../../common/errors/httpError.js";
import Token from "../../token/domain/token.js";
import User from "../../user/domain/user.js";

export default class AuthService {
  constructor(userRepository, tokenRepository, jwtUtils, authEmailService) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.jwtUtils = jwtUtils;
    this.authEmailService = authEmailService;
  }

  async registerUser(userData) {
    if (!userData) {
      throw new HttpError("User data cannot be empty", 400);
    }

    // Make sure user does not exist yet
    const existingUser = await this.userRepository.findByUsernameOrEmail(
      userData.username,
      userData.email
    );
    if (existingUser) {
      throw new HttpError("Username or email already in used", 400);
    }

    // Save user to database
    const hashedPassword = await Auth.hashPassword(userData.password);
    const user = User.create({
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      isActive: false,
    });
    const result = await this.userRepository.save(user);

    // Send email verification
    await this.authEmailService.sendEmailConfirmation(
      user.email,
      user.firstName ?? user.username
    );

    return { id: result.id, username: user.username, email: user.email };
  }

  async loginUser(email, password) {
    const errorMessage = "Invalid email or password";

    // Verify if user exist
    const user = await this.userRepository.findByUsernameOrEmail(null, email);
    if (user === null) throw new HttpError(errorMessage, 401);

    // Verify if password is correct
    const isValidPassword = await Auth.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) throw new HttpError(errorMessage, 401);

    // Return existing token if not yet expired
    // otherwise create new one
    const existingToken = await this.tokenRepository.findByUserId(user.id);
    let token;
    if (existingToken) {
      token = existingToken.token;
    } else {
      token = await this.jwtUtils.generateToken({
        id: user.id,
        email: user.email,

        // Add additional custom claims here...
      });
      const tokenExpiresAt = await this.jwtUtils.getTokenExpiry(token);

      const newToken = Token.create({
        userId: user.id,
        token: token,
        tokenType: "access",
        expiresAt: new Date(tokenExpiresAt),
      });
      await this.tokenRepository.save(newToken);
    }

    return {
      user: { id: user.id, username: user.username, email: user.email },
      token,
    };
  }

  async forgotPassword(email) {
    // TODO
  }

  async verifyEmail(email, otp) {
    // TODO
  }
}
