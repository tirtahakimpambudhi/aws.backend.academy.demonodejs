import { expect } from 'chai';
import User from '../../src/model/User.js'; // Assuming the User class is in the file 'User.js'

describe('User Class', function () {
  // Test Case 1: Constructor - Ensure User is initialized correctly
  it('should create a user with the correct attributes', function () {
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(
      1,
      'Alice',
      'alice@example.com',
      createdAt,
      updatedAt
    );

    expect(user).to.be.an.instanceof(User);
    expect(user.id).to.equal(1);
    expect(user.name).to.equal('Alice');
    expect(user.email).to.equal('alice@example.com');
    expect(user.createdAt).to.equal(createdAt);
    expect(user.updatedAt).to.equal(updatedAt);
  });

  // Test Case 2: Update user information - Update name and email
  it("should update the user's name and email", function () {
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(2, 'Bob', 'bob@example.com', createdAt, updatedAt);
    const newUpdatedAt = new Date();
    user.update('Bob Marley', 'bob.marley@example.com', newUpdatedAt);

    expect(user.name).to.equal('Bob Marley');
    expect(user.email).to.equal('bob.marley@example.com');
    expect(user.updatedAt).to.equal(newUpdatedAt);
  });

  // Test Case 3: Update user information - Update only name
  it("should update the user's name only", function () {
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(
      3,
      'Charlie',
      'charlie@example.com',
      createdAt,
      updatedAt
    );
    const newUpdatedAt = new Date();
    user.update('Charlie Brown', undefined, newUpdatedAt);

    expect(user.name).to.equal('Charlie Brown');
    expect(user.email).to.equal('charlie@example.com');
    expect(user.updatedAt).to.equal(newUpdatedAt);
  });

  // Test Case 4: Update user information - Update only email
  it("should update the user's email only", function () {
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(4, 'Dave', 'dave@example.com', createdAt, updatedAt);
    const newUpdatedAt = new Date();
    user.update(undefined, 'dave.new@example.com', newUpdatedAt);

    expect(user.name).to.equal('Dave');
    expect(user.email).to.equal('dave.new@example.com');
    expect(user.updatedAt).to.equal(newUpdatedAt);
  });

  // Test Case 5: Update user information - No updates
  it('should not update the user if no valid fields are provided', function () {
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(5, 'Eve', 'eve@example.com', createdAt, updatedAt);
    user.update(); // Call update with no parameters

    expect(user.name).to.equal('Eve');
    expect(user.email).to.equal('eve@example.com');
    expect(user.updatedAt).to.equal(updatedAt);
  });

  // Test Case 6: Update user with a new updatedAt only
  it('should update only the updatedAt timestamp', function () {
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User(
      6,
      'Frank',
      'frank@example.com',
      createdAt,
      updatedAt
    );
    const newUpdatedAt = new Date();
    user.update(undefined, undefined, newUpdatedAt);

    expect(user.name).to.equal('Frank');
    expect(user.email).to.equal('frank@example.com');
    expect(user.updatedAt).to.equal(newUpdatedAt);
  });
});
