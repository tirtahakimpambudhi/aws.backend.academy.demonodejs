import User from '../model/User.js';

/**
 * Class representing a User management system.
 */
class Users {
  /**
   * Creates an instance of the Users class.
   * Initializes an empty array to store users.
   */
  #users;
  constructor() {
    this.#users = [];
  }

  /**
   * Create a new user and add it to the users list.
   *
   * @param {User} user - The user object to be added.
   */
  create(user) {
    const id = this.#users.length + 1;
    if (user instanceof User) {
      this.#users.push(user);
      console.log(`User ${user.name} created successfully.`);
      return;
    }
    // Check if it's an object literal with the required properties (id, name, email)
    if (user && typeof user === 'object' && user.name && user.email) {
      this.#users.push(
        new User(id, user.name, user.email, new Date(), new Date())
      );
      console.log(`User ${user.name} created successfully.`);
      return;
    }
    throw new Error(
      `The argument is not a valid User class or object literal: ${typeof user}`
    );
  }

  /**
   * Read a user by their ID.
   *
   * @param {number} userId - The ID of the user to be read.
   * @returns {User|Error} The user object if found, or null if not found.
   */
  read(userId) {
    const user = this.#users.find((user) => user.id === userId);
    if (user) {
      return user;
    } else {
      console.error(`User with id ${userId} not found.`);
      throw Error(`user with id ${userId} not found.`);
    }
  }

  /**
   * Update an existing user by their ID.
   *
   * @param {number} userId - The ID of the user to be updated.
   * @param {Object} updatedUserData - An object containing the new user data.
   * @param {string} [updatedUserData.name] - The new name for the user (optional).
   * @param {string} [updatedUserData.email] - The new email for the user (optional).
   * @param {Date} [updatedUserData.updatedAt] - The new updatedAt timestamp.
   */
  update(userId, updatedUserData) {
    const user = this.#users.find((user) => user.id === userId);
    if (user) {
      user.update(
        updatedUserData.name,
        updatedUserData.email,
        updatedUserData.updatedAt
      );
      console.log(`User ${userId} updated successfully.`);
    } else {
      console.log(`User with id ${userId} not found.`);
      throw Error(`user with id ${userId} not found.`);
    }
  }

  /**
   * Delete a user by their ID.
   *
   * @param {number} userId - The ID of the user to be deleted.
   */
  delete(userId) {
    const index = this.#users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.#users.splice(index, 1);
      console.log(`User with id ${userId} deleted successfully.`);
    } else {
      console.log(`User with id ${userId} not found.`);
      throw Error(`user with id ${userId} not found.`);
    }
  }

  /**
   * Get all users in the system.
   *
   * @returns {Array} An array of all user objects.
   */
  getAll() {
    return this.#users;
  }
}

export default Users;
