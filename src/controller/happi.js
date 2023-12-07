import Notes from '../db/Notes.js';
import Boom from '@hapi/boom';
import { DatabaseError } from '../db/Error.js';

/**
 * Class Controller for contains a collection of functions handler http from happi
 */
class Controller {
  constructor() {
    this.db = new Notes();
  }
  /**
   *
   * @param {Request} request
   * @param {ResponseToolkit} h
   */
  addNote = (request, h) => {
    try {
      const payload = request.payload;
      const note = this.db.create(payload);
      return h
        .response({
          statusCode: 201,
          status: 'STATUS_CREATED',
          message: 'Successfully created note',
          data: {
            id: note.id
          }
        })
        .type('application/json')
        .code(201);
    } catch (error) {
      throw error instanceof DatabaseError
        ? Boom.boomify(error, { statusCode: error.code.httpCode })
        : Boom.internal(error);
    }
  };

  getAllNote = (request, h) => {
    try {
      const notes = this.db.getAll();
      return h
        .response({
          statusCode: 200,
          status: 'STATUS_OK',
          message: 'Successfully get all notes',
          data: {
            notes
          }
        })
        .type('application/json')
        .code(201);
    } catch (error) {
      throw error instanceof DatabaseError
        ? Boom.boomify(error, { statusCode: error.code.httpCode })
        : Boom.internal(error);
    }
  };

  getNoteByID = (request, h) => {
    try {
      const noteId = request.params.noteId;
      console.log(noteId);
      const note = this.db.read(noteId);
      return h
        .response({
          statusCode: 200,
          status: 'STATUS_OK',
          message: 'Successfully get by id note',
          data: {
            note
          }
        })
        .type('application/json')
        .code(201);
    } catch (error) {
      throw error instanceof DatabaseError
        ? Boom.boomify(error, { statusCode: error.code.httpCode })
        : Boom.internal(error);
    }
  };

  updateNoteByID = (request, h) => {
    try {
      const noteId = request.params.noteId;
      const payload = request.payload;
      this.db.update(noteId, payload);
      return h
        .response({
          statusCode: 200,
          status: 'STATUS_OK',
          message: 'Successfully update by id note',
          data: null
        })
        .type('application/json')
        .code(201);
    } catch (error) {
      throw error instanceof DatabaseError
        ? Boom.boomify(error, { statusCode: error.code.httpCode })
        : Boom.internal(error);
    }
  };
  deleteNoteByID = (request, h) => {
    try {
      const noteId = request.params.noteId;
      this.db.delete(noteId);
      return h
        .response({
          statusCode: 200,
          status: 'STATUS_OK',
          message: 'Successfully delete by id note',
          data: null
        })
        .type('application/json')
        .code(201);
    } catch (error) {
      throw error instanceof DatabaseError
        ? Boom.boomify(error, { statusCode: error.code.httpCode })
        : Boom.internal(error);
    }
  };
}

export default Controller;
