import { expect } from 'chai';
import User from '../../src/model/User.js';
import Users from '../../src/db/Users.js'; // Assuming Users class is in 'Users.js'

// Helper function to create a new User
const createTestUser = (id) => {
  const createdAt = new Date();
  const updatedAt = new Date();
  return new User(
    id,
    `User ${id}`,
    `user${id}@example.com`,
    createdAt,
    updatedAt
  );
};

describe('Users Class', () => {
  let userManager;

  // Initialize a fresh instance of Users class before each test
  beforeEach(() => {
    userManager = new Users();
  });

  // Test Case 1: Create user successfully
  it('should create a user successfully', () => {
    const user = createTestUser(1);
    userManager.create(user);

    // Verify user has been added
    const users = userManager.getAll();
    expect(users).to.have.lengthOf(1);
    expect(users[0].id).to.equal(1);
    expect(users[0].name).to.equal('User 1');
  });

  // Test Case 2: Fail to create user with invalid type (not User object)
  it('should throw error when creating a user with invalid argument', () => {
    const invalidUser = { id: 2, name: 'Invalid User' }; // Not a User instance
    expect(() => userManager.create(invalidUser)).to.throw(
      Error,
      'The argument is not a valid User class or object literal'
    );
  });

  // Test Case 3: Read user by ID - Success
  it('should read a user by ID successfully', () => {
    const user1 = createTestUser(1);
    userManager.create(user1);

    const foundUser = userManager.read(1);
    expect(foundUser).to.be.an.instanceof(User);
    expect(foundUser.id).to.equal(1);
    expect(foundUser.name).to.equal('User 1');
  });

  // Test Case 4: Read user by ID - Fail (User not found)
  it('should throw error if user ID is not found', () => {
    expect(() => userManager.read(999)).to.throw(
      Error,
      'user with id 999 not found.'
    );
  });

  // Test Case 5: Update user by ID successfully
  it("should update a user's information by ID successfully", () => {
    const user1 = createTestUser(1);
    userManager.create(user1);

    const updatedData = {
      name: 'Updated User',
      email: 'updated@example.com',
      updatedAt: new Date().toISOString()
    };
    userManager.update(1, updatedData);

    const updatedUser = userManager.read(1);
    expect(updatedUser.name).to.equal('Updated User');
    expect(updatedUser.email).to.equal('updated@example.com');
  });

  // Test Case 6: Update user by ID - Fail (User not found)
  it('should throw error if user ID to be updated is not found', () => {
    const updatedData = {
      name: 'Updated User',
      email: 'updated@example.com',
      updatedAt: new Date().toISOString()
    };
    expect(() => userManager.update(999, updatedData)).to.throw(
      Error,
      'user with id 999 not found.'
    );
  });

  // Test Case 7: Delete user by ID successfully
  it('should delete a user by ID successfully', () => {
    const user1 = createTestUser(1);
    userManager.create(user1);

    userManager.delete(1);
    const users = userManager.getAll();
    expect(users).to.have.lengthOf(0); // List should be empty after deletion
  });

  // Test Case 8: Delete user by ID - Fail (User not found)
  it('should throw error if user ID to be deleted is not found', () => {
    expect(() => userManager.delete(999)).to.throw(
      Error,
      'user with id 999 not found.'
    );
  });

  // Test Case 9: Get all users (empty list)
  it('should return an empty list when no users are created', () => {
    const users = userManager.getAll();
    expect(users).to.have.lengthOf(0); // List should be empty
  });

  // Test Case 10: Get all users (with some users)
  it('should return all created users', () => {
    const user1 = createTestUser(1);
    const user2 = createTestUser(2);
    userManager.create(user1);
    userManager.create(user2);

    const users = userManager.getAll();
    expect(users).to.have.lengthOf(2);
    expect(users[0].id).to.equal(1);
    expect(users[1].id).to.equal(2);
  });
});
