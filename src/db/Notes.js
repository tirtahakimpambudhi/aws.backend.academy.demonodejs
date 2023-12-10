import Note from '../model/Note.js';
import { Code, DatabaseError } from './Error.js';

/**
 * Class representing a Notes management system.
 */
class Notes {
  /**
   * Creates an instance of the Notes class.
   * Initializes an empty array to store notes.
   */
  #notes;
  constructor() {
    this.#notes = [];
  }

  /**
   * Create a new note and add it to the notes list.
   *
   * @param {Note|Object} note - The note object to be added.
   * @returns {Note} The created note
   */
  create(note) {
    // If the note is already a Note instance
    if (note instanceof Note) {
      this.#notes.push(note);
      console.log(`Note ${note.title} created successfully.`);
      return note;
    }

    // If it's an object literal with required properties
    if (note && typeof note === 'object' && note.title && note.body) {
      const newNote = new Note(note.title, note.tags || [], note.body);
      this.#notes.push(newNote);
      console.log(`Note ${newNote.title} created successfully.`);
      return newNote;
    }

    throw new DatabaseError(
      `The argument is not a valid Note class or object literal: ${typeof note}`,
      Code.INVALID_PARAM
    );
  }

  /**
   * Read a note by its ID.
   *
   * @param {string} noteId - The ID of the note to be read.
   * @returns {Note} The note object if found.
   */
  read(noteId) {
    const note = this.#notes.find((note) => note.id === noteId);
    if (note) {
      return note;
    } else {
      console.error(`Note with id ${noteId} not found.`);
      throw new DatabaseError(
        `Note with id ${noteId} not found.`,
        Code.NOT_FOUND
      );
    }
  }

  /**
   * Update an existing note by its ID.
   *
   * @param {string} noteId - The ID of the note to be updated.
   * @param {Object} updatedNoteData - An object containing the new note data.
   * @param {string} [updatedNoteData.title] - The new title for the note (optional).
   * @param {string[]} [updatedNoteData.tags] - The new tags for the note (optional).
   * @param {string} [updatedNoteData.body] - The new body content for the note (optional).
   */
  update(noteId, updatedNoteData) {
    const note = this.#notes.find((note) => note.id === noteId);
    if (note) {
      note.update(
        updatedNoteData.title,
        updatedNoteData.tags,
        updatedNoteData.body
      );
      note.updatedAt = new Date();
      console.log(`Note ${noteId} updated successfully.`);
      return note;
    } else {
      console.log(`Note with id ${noteId} not found.`);
      throw new DatabaseError(
        `Note with id ${noteId} not found.`,
        Code.NOT_FOUND
      );
    }
  }

  /**
   * Delete a note by its ID.
   *
   * @param {string} noteId - The ID of the note to be deleted.
   */
  delete(noteId) {
    const index = this.#notes.findIndex((note) => note.id === noteId);
    if (index !== -1) {
      const deletedNote = this.#notes.splice(index, 1)[0];
      console.log(`Note with id ${noteId} deleted successfully.`);
      return deletedNote;
    } else {
      console.log(`Note with id ${noteId} not found.`);
      throw new DatabaseError(
        `Note with id ${noteId} not found.`,
        Code.NOT_FOUND
      );
    }
  }

  /**
   * Get all notes in the system.
   *
   * @returns {Note[]} An array of all note objects.
   */
  getAll() {
    return this.#notes;
  }

  /**
   * Find notes by tag.
   *
   * @param {string} tag - The tag to search for.
   * @returns {Note[]} An array of notes with the specified tag.
   */
  findByTag(tag) {
    return this.#notes.filter((note) => note.tags.includes(tag));
  }

  /**
   * Search notes by a search term in title or body.
   *
   * @param {string} searchTerm - The term to search for.
   * @returns {Note[]} An array of notes matching the search term.
   */
  search(searchTerm) {
    const lowercaseTerm = searchTerm.toLowerCase();
    return this.#notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowercaseTerm) ||
        note.body.toLowerCase().includes(lowercaseTerm)
    );
  }
}

export default Notes;
