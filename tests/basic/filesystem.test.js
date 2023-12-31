import {
  copyFileStream,
  readFileAsync,
  readFileStream,
  writeFileAsync,
  writeFileStream
} from '../../src/basic/filesystem.js';
import { writeFile, rm, stat } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Test Filesystem Module', () => {
  const filename = 'testing-text.txt';
  const text = 'testing content';
  const data = new Uint8Array(Buffer.from(text));

  let consoleSpy;

  beforeEach(async () => {
    consoleSpy = sinon.spy(console, 'error');
    await writeFile(filename, data);
  });

  afterEach(async () => {
    consoleSpy.restore();
    await rm(filename);
  });

  describe('Test Read Write Filesystem Module', () => {
    describe('ReadFile Test', () => {
      // Test case to check if the file is read successfully
      it('Should successfully read the file', async () => {
        const result = await readFileAsync(filename);
        expect(result).to.eq(text);
      });
      // Test case to check if the file is read failure
      it('Should failure read the file because not exist', async () => {
        try {
          await readFileAsync('not-exist-file.txt');
          expect.fail();
        } catch (error) {
          expect(error.message).to.not.empty;
          expect(error.message).to.include('ENOENT: no such file or directory');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error reading file');
      });
      it('Should failure read the file because not filename', async () => {
        try {
          await readFileAsync(process.cwd());
          expect.fail();
        } catch (error) {
          expect(error.message).to.not.empty;
          expect(error.message).to.include(
            'EISDIR: illegal operation on a directory'
          );
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error reading file');
      });
      it('Should failure read the file because invalid argument', async () => {
        try {
          await readFileAsync(1);
          expect.fail();
        } catch (error) {
          expect(error.message).to.not.empty;
          expect(error.message).to.include(
            'The "path" argument must be of type string'
          );
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error reading file');
      });
    });
    describe('WriteFile Test', () => {
      // Test case to check if the file is write successfully
      it('Should successfully write the file exist', async () => {
        await writeFileAsync(filename, 'Hello World');
        const result = await readFileAsync(filename);
        expect(result).to.eq('Hello World');
      });

      it('Should successfully write the file not exist', async () => {
        const filepath = `${process.cwd()}/testing-write-file.txt`;
        await writeFileAsync(filepath, 'Hello World');
        const result = await readFileAsync(filepath);
        expect(result).to.eq('Hello World');
        await rm(filepath);
      });

      it('Should successfully write the file with arg number', async () => {
        const filepath = `${process.cwd()}/testing-write-file.txt`;
        await writeFileAsync(filepath, 123);
        const result = await readFileAsync(filepath);
        expect(parseInt(result)).to.eq(123);
        await rm(filepath);
      });

      // Test case to check if the file is write failure
      it('Should failure write the file with directory not exist', async () => {
        const filepath = `${process.cwd()}/directoryNotExist/testing-write-file.txt`;
        try {
          await writeFileAsync(filepath, 'testing-not-exist-directory');
          expect.fail();
        } catch (error) {
          expect(error.message).to.not.empty;
          expect(error.message).to.include('ENOENT: no such file or directory');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error writing file');
      });
    });
  });
  describe('Test Read,Write,Copy Stream Filesystem Module', () => {
    describe('ReadFileStream Test', () => {
      // Test case to check if the file is read successfully
      it('Should successfully read stream the file', async () => {
        const result = await readFileStream(filename);
        expect(result).to.eq(text);
      });
      // Test case to check if the file is read failure
      it('Should failure read stream the file because not exist', async () => {
        try {
          await readFileStream('not-exist-file.txt');
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include('ENOENT: no such file or directory');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error reading file');
      });
      it('Should failure read stream the file because not filename', async () => {
        try {
          await readFileStream(process.cwd());
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include('is not a file');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error reading file');
      });
      it('Should failure read stream the file because invalid argument', async () => {
        try {
          await readFileStream(1);
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include(
            'The "path" argument must be of type string'
          );
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error reading file');
      });
    });
    describe('WriteFile Stream Test', () => {
      // Test case to check if the file is write successfully
      it('Should successfully write stream the file exist', async () => {
        await writeFileStream(filename, 'Hello World');
        const result = await readFileAsync(filename);
        expect(result).to.eq('Hello World');
      });

      it('Should successfully write stream the file not exist', async () => {
        const filepath = `${process.cwd()}/testing-write-file.txt`;
        await writeFileStream(filepath, 'Hello World');
        const result = await readFileStream(filepath);
        expect(result).to.eq('Hello World');
        await rm(filepath);
      });

      it('Should successfully write stream the file with arg number', async () => {
        const filepath = `${process.cwd()}/testing-write-file.txt`;
        await writeFileAsync(filepath, 123);
        const result = await readFileAsync(filepath);
        expect(parseInt(result)).to.eq(123);
        await rm(filepath);
      });

      // Test case to check if the file is write failure
      it('Should failure write stream the file with directory not exist', async () => {
        const filepath = `${process.cwd()}/directoryNotExist/testing-write-file.txt`;
        try {
          await writeFileStream(filepath, 'testing-not-exist-directory');
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include('ENOENT: no such file or directory');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error writing file');
      });
    });
    describe('CopyFileStream Test', () => {
      // Test case to check if the file is read successfully
      it('Should successfully copy stream the file', async () => {
        await copyFileStream(filename, 'copy-file.txt');
        const statFile = await stat('copy-file.txt');
        expect(statFile.isFile()).to.true;
      });
      // Test case to check if the file is read failure
      it('Should failure copy stream the file because not exist', async () => {
        try {
          await copyFileStream('not-exist-file.txt', 'copy-file.txt');
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include('ENOENT: no such file or directory');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error copying file');
      });
      it('Should failure copy stream the file because not filename', async () => {
        try {
          await copyFileStream(process.cwd());
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include('is not a file');
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error copying file');
      });
      it('Should failure copy stream the file because invalid argument', async () => {
        try {
          await copyFileStream(1);
          expect.fail();
        } catch (error) {
          // Check that the error message exists and is not empty
          expect(error.message).to.not.be.empty;
          // Optionally, be more specific about the error
          expect(error.message).to.include(
            'The "path" argument must be of type string'
          );
        }
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.args[0][0]).to.include('Error copying file');
      });
    });
  });
});
