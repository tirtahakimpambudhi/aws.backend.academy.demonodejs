import {
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  stat,
  access
} from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { Buffer } from 'node:buffer';
import { dirname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

/**
 * Reads a file asynchronously using promises
 * @param {string} filepath - The path to the file to be read
 * @returns {Promise<string|undefined>} The content of the file as a string, or undefined if an error occurs
 * @throws {Error} If the file doesn't exist or is not a regular file
 * @example
 * try {
 *   const content = await readFileAsync('path/to/file.txt');
 *   console.log(content);
 * } catch (error) {
 *   console.error(error);
 * }
 */
const readFileAsync = async (filepath) => {
  try {
    const statFile = await stat(filepath);
    if (!statFile.isFile()) new Error(`${filepath} is not file`);
    return await fsReadFile(filepath, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
};

/**
 * Writes content to a file asynchronously using promises
 * @param {string} filepath - The path to the file to write to
 * @param {string|Buffer} content - The content to write to the file
 * @returns {Promise<void>} A promise that resolves when the write is complete
 * @throws {Error} If the content is empty or the directory doesn't exist
 * @example
 * try {
 *   await writeFileAsync('path/to/file.txt', 'Hello World');
 * } catch (error) {
 *   console.error(error);
 * }
 */
const writeFileAsync = async (filepath, content) => {
  try {
    if (
      content === undefined ||
      content === null ||
      (typeof content === 'string' && content.length === 0) ||
      (Buffer.isBuffer(content) && content.length === 0)
    )
      new Error('Content is empty or not valid.');
    await access(dirname(filepath));
    const data = new Uint8Array(Buffer.from(content.toString()));
    await fsWriteFile(filepath, data);
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    throw error;
  }
};

/**
 * Reads a file using streams
 * @param {string} filepath - The path to the file to read
 * @returns {Promise<string>} The content of the file as a string
 * @throws {Error} If the file doesn't exist or is not a regular file
 * @example
 * try {
 *   const content = await readFileStream('path/to/large-file.txt');
 *   console.log(content);
 * } catch (error) {
 *   console.error(error);
 * }
 */
const readFileStream = async (filepath) => {
  try {
    const statFile = await stat(filepath);
    if (!statFile.isFile()) {
      throw new Error(`${filepath} is not a file`);
    }

    const chunks = [];
    const readStream = createReadStream(filepath, {
      encoding: 'utf8',
      highWaterMark: 64 * 1024 // 64KB chunks
    });

    return new Promise((resolve, reject) => {
      readStream.on('data', (chunk) => chunks.push(chunk));
      readStream.on('end', () => resolve(chunks.join('')));
      readStream.on('error', (error) => reject(error));
    });
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
};

/**
 * Writes content to a file using streams
 * @param {string} filepath - The path to the file to write to
 * @param {string|Buffer} content - The content to write to the file
 * @returns {Promise<void>} A promise that resolves when the write is complete
 * @throws {Error} If the content is empty or the directory doesn't exist
 * @example
 * try {
 *   await writeFileStream('path/to/large-file.txt', 'Large content here');
 * } catch (error) {
 *   console.error(error);
 * }
 */
const writeFileStream = async (filepath, content) => {
  try {
    if (
      content === undefined ||
      content === null ||
      (typeof content === 'string' && content.length === 0) ||
      (Buffer.isBuffer(content) && content.length === 0)
    ) {
      throw new Error('Content is empty or not valid.');
    }

    await access(dirname(filepath));
    const writeStream = createWriteStream(filepath);
    const readableStream = Readable.from(content.toString());

    await pipeline(readableStream, writeStream);
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    throw error;
  }
};

/**
 * Copies a file using streams
 * @param {string} source - The path to the source file
 * @param {string} destination - The path to the destination file
 * @returns {Promise<void>} A promise that resolves when the copy is complete
 * @throws {Error} If the source file doesn't exist or destination directory is not accessible
 * @example
 * try {
 *   await copyFileStream('source.txt', 'destination.txt');
 * } catch (error) {
 *   console.error(error);
 * }
 */
const copyFileStream = async (source, destination) => {
  try {
    const statFile = await stat(source);
    if (!statFile.isFile()) {
      throw new Error(`${source} is not a file`);
    }

    await access(dirname(destination));
    const readStream = createReadStream(source);
    const writeStream = createWriteStream(destination);

    await pipeline(readStream, writeStream);
  } catch (error) {
    console.error(`Error copying file: ${error.message}`);
    throw error;
  }
};

// Export all functions
export {
  readFileAsync,
  writeFileAsync,
  readFileStream,
  writeFileStream,
  copyFileStream
};
