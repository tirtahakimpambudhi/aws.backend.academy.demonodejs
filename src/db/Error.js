/**
 * class Code for enum field code in DatabaseError
 */
export class Code {
  static NOT_FOUND = new Code('NOT_FOUND', 404);
  static INVALID_PARAM = new Code('INVALID_PARAM', 422);
  static CONFLICT = new Code('CONFLICT', 409);

  /**
   *
   * @param {String} codename for name error database
   * @param {Number} httpCode for convert code error database to http code
   */
  constructor(codename, httpCode) {
    this.codename = codename;
    this.httpCode = isNaN(httpCode) || !httpCode ? 500 : httpCode;
  }
}
/**
 * class DatabaseError used for custom error database
 */
export class DatabaseError extends Error {
  /**
   *
   * @param {String} message
   * @param {Code} code
   */
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
