import Auth from "../domain/auth.js";
import HttpError from "../../../common/errors/httpError.js";
import Token from "../../token/domain/token.js";
import TokenRepository from "../../token/infrastructure/tokenRepository.js";
import TokenType from "../../token/domain/tokenType.js";
import User from "../../user/domain/user.js";
import { jwtConfig } from "../../../common/config/config.js";

export default class AuthService {
  constructor(userRepository, tokenRepository, jwtUtils, authEmailService) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.jwtUtils = jwtUtils;
    this.authEmailService = authEmailService;
  }

  /**
   * Register user
   *
   * @param {string} username Unique username of the user
   * @param {string} email Unique email of the user
   * @param {string} password The password (in plain) of the user
   * @returns {object} Newly created user with the id
   */
  async registerUser(username, email, password) {
    // Make sure user does not exist yet
    const existingUser = await this.userRepository.findByUsernameOrEmail(
      username,
      email
    );
    if (existingUser)
      throw new HttpError("Username or email already in used", 400);

    // Save user to database
    const hashedPassword = await Auth.hashPassword(password);
    const user = User.create({
      username,
      email,
      passwordHash: hashedPassword,
      isActive: false,
    });
    const userId = await this.userRepository.save(user);

    // Send email verification
    const token = await generateToken(
      {
        id: userId,
        username: user.username,
        email: user.email,
      },
      TokenType.ONE_TIME_TOKEN,
      jwtConfig.confirmEmailTokenExpiresIn,
      this.jwtUtils,
      this.tokenRepository
    );
    await this.authEmailService.sendEmailConfirmation(
      user.email,
      token,
      user.firstName ?? user.username
    );

    return { id: userId, username: user.username, email: user.email };
  }

  /**
   * Login user
   *
   * @param {string} email The email of the user
   * @param {string} password The password of the user
   * @returns {object} The user info along with the access token
   */
  async loginUser(email, password) {
    const errorMessage = "Invalid email or password";

    // Make sure user exist
    const user = await this.userRepository.findByUsernameOrEmail(null, email);
    if (user === null) throw new HttpError(errorMessage, 401);

    // Make sure password is correct
    const isValidPassword = await Auth.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) throw new HttpError(errorMessage, 401);

    // Make sure email is validated
    if (!user.isActive)
      throw new HttpError(
        "Email is not yet validated, please verify your email first",
        401
      );

    // Return existing token if not yet expired
    // otherwise create new one
    const existingToken = await this.tokenRepository.findByUserId(
      user.id,
      TokenType.ACCESS
    );
    let token;
    if (existingToken) {
      token = existingToken.token;
    } else {
      token = await generateToken(
        {
          id: user.id,
          username: user.username,
          email: user.email,

          // Add additional custom claims here...
        },
        TokenType.ACCESS,
        jwtConfig.accessTokenExpiresIn,
        this.jwtUtils,
        this.tokenRepository
      );
    }

    return {
      user: { id: user.id, username: user.username, email: user.email },
      token,
    };
  }

  /**
   * Request for a forgot password link
   *
   * @param {string} email The email of the user
   * @returns {void}
   */
  async forgotPassword(email) {
    // Check if email exist in the database
    const user = await this.userRepository.findByUsernameOrEmail(null, email);
    if (user === null) throw new HttpError("Email does not exist", 400);

    // Make sure user is activated first
    if (!user.isActive)
      throw new HttpError("Email is inactive, please verify it first", 400);

    // Return existing token if not yet expired
    // otherwise generate a new token using the ff: id, username, email
    const existingToken = await this.tokenRepository.findByUserId(
      user.id,
      TokenType.ONE_TIME_TOKEN
    );
    let token;
    if (existingToken) {
      token = existingToken.token;
    } else {
      token = await generateToken(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        TokenType.ONE_TIME_TOKEN,
        jwtConfig.forgotPasswordTokenExpiresIn,
        this.jwtUtils,
        this.tokenRepository
      );
    }

    // Send email verification
    await this.authEmailService.sendForgotPasswordUrl(
      user.email,
      token,
      user.firstName ?? user.username
    );
  }

  /**
   * Reset user password
   *
   * @param {string} email The email of the user
   * @param {string} password The new password of the user
   * @param {string} token The token string included from the forgot password link
   * @returns {void}
   */
  async resetPassword(email, password, token) {
    // Make sure token is valid
    let decodedTokenExpiry;
    try {
      const decodedToken = await this.jwtUtils.verifyToken(token);
      decodedTokenExpiry = decodedToken.exp * 1000;
    } catch (err) {
      throw new HttpError("Link is invalid, please request a new one", 400);
    }

    // Make sure token is not yet expired
    if (new Date(decodedTokenExpiry) < new Date())
      throw new HttpError("Link is expired, please request a new one", 400);

    // Check if email exist in the database
    const user = await this.userRepository.findByUsernameOrEmail(null, email);
    if (user === null) throw new HttpError("Email does not exist", 400);

    // Double-check token validity from our database copy
    const existingToken = await this.tokenRepository.findByTokenValue(
      token,
      TokenType.ONE_TIME_TOKEN
    );
    if (existingToken === null)
      throw new HttpError("Link is invalid, please request a new one", 400);

    //  Generate new password and update user
    const newPassword = await Auth.hashPassword(password);
    user.setPassword(newPassword);
    const isSuccessful = await this.userRepository.update(user);
    if (!isSuccessful)
      throw new Error("Unable to update password, please try again later!");

    // Expires token so it will never be used again
    const dateMinusOneDay = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );
    existingToken.setExpiresAt(dateMinusOneDay);
    await this.tokenRepository.update(existingToken);

    // TODO: Remove existing login tokens
  }

  /**
   * Verify email
   *
   * @param {string} email The email of the user
   * @param {string} token The token string included from the email confirmation link
   * @returns {void}
   */
  async verifyEmail(email, token) {
    // Make sure token is valid
    let decodedToken;
    let decodedTokenExpiry;
    try {
      decodedToken = await this.jwtUtils.verifyToken(token);
      decodedTokenExpiry = decodedToken.exp * 1000;
    } catch (err) {
      throw new HttpError("Link is invalid, please request a new one", 400);
    }

    // Make sure token is not yet expired
    if (new Date(decodedTokenExpiry) < new Date())
      throw new HttpError("Link is expired, please request a new one", 400);

    // Make sure email is already registered
    const user = await this.userRepository.findByUsernameOrEmail(null, email);
    if (user === null) throw new HttpError("Email does not exist", 400);

    // Make sure user is not yet verified
    if (user.isActive) throw new HttpError("Email is already verified", 400);

    // Double-check token validity from our database copy
    const existingToken = await this.tokenRepository.findByTokenValue(
      token,
      TokenType.ONE_TIME_TOKEN
    );
    if (existingToken === null)
      throw new HttpError("Link is invalid, please request a new one", 400);

    // Enable user
    user.activate();
    const isSuccessful = await this.userRepository.update(user);
    if (!isSuccessful)
      throw new Error("Unable to active user, please try again later!");

    // Expires token so it will never be used again
    const dateMinusOneDay = new Date(
      new Date().setDate(new Date().getDate() - 1)
    );
    await this.tokenRepository.update(existingToken);
  }

  /**
   * Re-send the email confirmation link
   *
   * @param {*} email
   */
  async resendEmailConfirmationLink(email) {
    // Make sure email is registered
    const user = await this.userRepository.findByUsernameOrEmail(null, email);
    if (user === null) throw new HttpError("Email does not exist", 400);

    // Make sure user's email is not yet verified
    if (user.isActive) throw new HttpError("Email is already verified", 400);

    // Return existing token if not yet expired
    // otherwise generate a new token using the ff: id, username, email
    let token;
    const existingToken = await this.tokenRepository.findByUserId(
      user.id,
      TokenType.ONE_TIME_TOKEN
    );
    if (existingToken) {
      token = existingToken.token;
    } else {
      token = await generateToken(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        TokenType.ONE_TIME_TOKEN,
        jwtConfig.confirmEmailTokenExpiresIn,
        this.jwtUtils,
        this.tokenRepository
      );
    }

    // Send email verification
    await this.authEmailService.sendEmailConfirmation(
      user.email,
      token,
      user.firstName ?? user.username
    );
  }
}

/**
 *
 * @param {User} user The user data use for generating token
 * @param {string} expiresIn The expiry of the token that will be generated
 * @param {TokenType} tokenType The type of token to generate
 * @param {JwtUtils} jwtUtils Utility class for JWT related functionalities
 * @param {TokenRepository} tokenRepository Repository class for Token entity
 * @returns {Promise<string>} The generated token string
 */
async function generateToken(
  user,
  tokenType,
  expiresIn,
  jwtUtils,
  tokenRepository
) {
  const token = await jwtUtils.generateToken({ ...user }, expiresIn);
  const tokenExpiresAt = await jwtUtils.getTokenExpiry(token);
  const newToken = Token.create({
    userId: user.id,
    token: token,
    tokenType: tokenType,
    expiresAt: new Date(tokenExpiresAt),
  });

  await tokenRepository.save(newToken);

  return token;
}
