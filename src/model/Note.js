import { v4 as uuidV4 } from 'uuid';
/**
 * Class Note represent note entity
 */
export default class Note {
  /**
   * constructor Note class for instance Note Object
   * @param {String} title the title note
   * @param {String[]} tags the tags for note
   * @param {String} body the content note
   */
  constructor(title, tags, body) {
    this.id = uuidV4();
    this.title = title;
    this.tags = tags;
    this.body = body;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * update the Note Object
   * @param {String} title the title note
   * @param {String[]} tags the tags for note
   * @param {String} body the content note
   */
  update(title, tags, body) {
    if (title) this.title = title;
    if (body) this.body = body;
    if (tags) this.tags = tags;
  }

  /**
   * for implement json able and convert note to json object
   * @returns {{id: string | Uint8Array, title: String, tags: String[], body: String, createdAt: string, updatedAt: (string|null)}}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      tags: this.tags,
      body: this.body,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null
    };
  }
}
