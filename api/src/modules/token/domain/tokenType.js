export default class TokenType {
  static ACCESS = "access";
  static ONE_TIME_TOKEN = "ott";
  static REFRESH_TOKEN = "refresh";

  static values() {
    return [this.ACCESS, this.ONE_TIME_TOKEN, this.REFRESH_TOKEN];
  }
}
