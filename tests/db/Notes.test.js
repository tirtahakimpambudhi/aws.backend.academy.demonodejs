import Notes from '../../src/db/Notes.js';
import Note from '../../src/model/Note.js';
import { DatabaseError } from '../../src/db/Error.js';
import { expect } from 'chai';

describe('Notes Database', () => {
  let notesDb;

  beforeEach(() => {
    notesDb = new Notes();
  });

  it('should create a new note from Note instance', () => {
    const note = new Note('Test', ['tag'], 'Body');
    const createdNote = notesDb.create(note);

    expect(createdNote).to.equal(note);
    expect(notesDb.getAll()).to.have.lengthOf(1);
  });

  it('should create a new note from object literal', () => {
    const noteData = { title: 'Test', tags: ['tag'], body: 'Body' };
    const createdNote = notesDb.create(noteData);

    expect(createdNote).to.be.instanceOf(Note);
    expect(notesDb.getAll()).to.have.lengthOf(1);
  });

  it('should throw error for invalid note creation', () => {
    expect(() => notesDb.create({})).to.throw(DatabaseError);
  });

  it('should read a note by ID', () => {
    const note = notesDb.create({ title: 'Test', body: 'Body' });
    const foundNote = notesDb.read(note.id);

    expect(foundNote).to.equal(note);
  });

  it('should throw error when reading non-existent note', () => {
    expect(() => notesDb.read('invalid-id')).to.throw(DatabaseError);
  });

  it('should update an existing note', () => {
    const note = notesDb.create({ title: 'Original', body: 'Body' });
    const updatedNote = notesDb.update(note.id, { title: 'Updated' });

    expect(updatedNote.title).to.equal('Updated');
    expect(updatedNote.updatedAt).to.not.equal(note.createdAt);
  });

  it('should delete a note by ID', () => {
    const note = notesDb.create({ title: 'Test', body: 'Body' });
    const deletedNote = notesDb.delete(note.id);

    expect(deletedNote).to.equal(note);
    expect(notesDb.getAll()).to.have.lengthOf(0);
  });

  it('should find notes by tag', () => {
    notesDb.create({ title: 'Note1', tags: ['work'], body: 'Body1' });
    notesDb.create({ title: 'Note2', tags: ['personal'], body: 'Body2' });
    notesDb.create({
      title: 'Note3',
      tags: ['work', 'important'],
      body: 'Body3'
    });

    const workNotes = notesDb.findByTag('work');
    expect(workNotes).to.have.lengthOf(2);
  });

  it('should search notes by term', () => {
    notesDb.create({
      title: 'Meeting Notes',
      body: 'Discussed project details'
    });
    notesDb.create({ title: 'Personal', body: 'Project planning' });

    const searchResults = notesDb.search('project');
    expect(searchResults).to.have.lengthOf(2);
  });
});
