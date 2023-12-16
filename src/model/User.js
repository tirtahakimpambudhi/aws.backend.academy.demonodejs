/**
 * Class representing a User.
 */
class User {
  /**
   * Creates an instance of the User class.
   * @param {number} id - The ID of the user.
   * @param {string} name - The name of the user.
   * @param {string} email - The email of the user.
   * @param {Date} createdAt - The timestamp when the user was created.
   * @param {Date} updatedAt - The timestamp when the user was last updated.
   */
  constructor(id, name, email, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Update the user's information.
   * @param {string} [name] - The new name of the user (optional).
   * @param {string} [email] - The new email of the user (optional).
   * @param {Date} [updatedAt] - The new updatedAt timestamp.
   */
  update(name, email, updatedAt) {
    if (name) this.name = name;
    if (email) this.email = email;
    if (updatedAt) this.updatedAt = updatedAt;
  }
  /**
   * For implement Json string able
   * @returns {{id: Number,name: String,email: String,createdAt: Date,updatedAt: Date}}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

export default User;
