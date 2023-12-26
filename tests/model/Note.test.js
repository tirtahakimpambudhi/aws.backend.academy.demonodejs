import Note from '../../src/model/Note.js';
import { expect } from 'chai';

describe('Note Application Test Suite', () => {
  describe('Note Model', () => {
    let note;

    beforeEach(() => {
      note = new Note('Test Title', ['tag1', 'tag2'], 'Test Body');
    });

    it('should create a new note with correct properties', () => {
      expect(note.title).to.equal('Test Title');
      expect(note.tags).to.deep.equal(['tag1', 'tag2']);
      expect(note.body).to.equal('Test Body');
      expect(note.id).to.exist;
      expect(note.createdAt).to.be.instanceOf(Date);
      expect(note.updatedAt).to.be.instanceOf(Date);
    });

    it('should update note properties correctly', () => {
      note.update('New Title', ['newtag'], 'New Body');

      expect(note.title).to.equal('New Title');
      expect(note.tags).to.deep.equal(['newtag']);
      expect(note.body).to.equal('New Body');
    });

    it('should convert note to JSON with correct structure', () => {
      const json = note.toJSON();

      expect(json).to.have.all.keys(
        'id',
        'title',
        'tags',
        'body',
        'createdAt',
        'updatedAt'
      );
      expect(json.title).to.equal('Test Title');
      expect(json.createdAt).to.be.a('string');
    });
  });
});
