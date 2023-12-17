import Controller from '../controller/happi.js';
import Boom from '@hapi/boom';
import {
  notePayloadValidate,
  noteIdParamsValidate,
  responseValidate
} from '../validation/happi.js';

const controller = new Controller();
/**
 *
 * @type ServerRoute<Refs>[] using routing server happi js
 */
export const router = [
  {
    method: 'GET',
    path: '/notes',
    handler: controller.getAllNote
  },
  {
    method: 'POST',
    path: '/notes',
    handler: controller.addNote,
    options: {
      validate: {
        payload: notePayloadValidate
      },
      response: responseValidate
    }
  },
  {
    method: '*',
    path: '/notes',

    handler: (request) => {
      throw Boom.methodNotAllowed(
        `method not allowed for path ${request.path}`
      );
    }
  },
  {
    method: 'GET',
    path: '/notes/{noteId}',
    handler: controller.getNoteByID,
    options: {
      validate: {
        params: noteIdParamsValidate
      },
      response: responseValidate
    }
  },
  {
    method: 'PUT',
    path: '/notes/{noteId}',
    handler: controller.updateNoteByID,
    options: {
      validate: {
        payload: notePayloadValidate,
        params: noteIdParamsValidate
      },
      response: responseValidate
    }
  },
  {
    method: 'DELETE',
    path: '/notes/{noteId}',
    handler: controller.deleteNoteByID,
    options: {
      validate: {
        params: noteIdParamsValidate
      },
      response: responseValidate
    }
  },
  {
    method: '*',
    path: '/notes/{id}',

    handler: (request) => {
      throw Boom.methodNotAllowed(
        `method not allowed for path ${request.path}`
      );
    }
  },
  {
    method: '*',
    path: '/{any*}',

    handler: (request) => {
      throw Boom.notFound(
        `method ${request.method} for path ${request.path} not found.`
      );
    }
  }
];
