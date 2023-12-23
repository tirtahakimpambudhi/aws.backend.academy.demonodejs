import { expect } from 'chai';
import Router from '../../src/core/Router.js';
import http from 'node:http';

describe('Router Test', () => {
  let router;

  beforeEach(() => {
    router = new Router();
  });

  describe('Path Validation', () => {
    it('should accept valid paths', () => {
      expect(() => router.validatePath('/valid-path')).to.not.throw();
      expect(() => router.validatePath('/users')).to.not.throw();
      expect(() => router.validatePath('/api/v1/users')).to.not.throw();
    });

    it('should reject invalid paths', () => {
      expect(() => router.validatePath('invalid-path')).to.throw(Error);
      expect(() => router.validatePath(123)).to.throw(Error);
      expect(() => router.validatePath('/invalid@path')).to.throw(Error);
    });
  });

  describe('Handler Validation', () => {
    it('should accept valid handlers', () => {
      expect(() => router.validateHandler(() => {})).to.not.throw();
      expect(() => router.validateHandler((req, res) => {})).to.not.throw();
    });

    it('should reject invalid handlers', () => {
      expect(() => router.validateHandler('not a function')).to.throw(Error);
      expect(() => router.validateHandler(123)).to.throw(Error);
      expect(() => router.validateHandler({})).to.throw(Error);
    });
  });

  describe('HTML Validation', () => {
    it('should accept valid HTML', () => {
      expect(() => router.validateHTML('<div>Hello</div>')).to.not.throw();
      expect(() => router.validateHTML('<p>Test</p>')).to.not.throw();
      expect(() =>
        router.validateHTML('<h1>Title</h1><p>Content</p>')
      ).to.not.throw();
    });

    it('should reject invalid HTML', () => {
      expect(() => router.validateHTML('')).to.throw(Error);
      expect(() => router.validateHTML(123)).to.throw(Error);
      expect(() => router.validateHTML('plain text')).to.throw(Error);
    });
  });

  describe('JSON Validation', () => {
    it('should accept valid JSON data', () => {
      expect(() => router.validateJSON({ key: 'value' })).to.not.throw();
      expect(() => router.validateJSON(['item1', 'item2'])).to.not.throw();
      expect(() =>
        router.validateJSON({ nested: { data: true } })
      ).to.not.throw();
    });

    it('should reject invalid JSON data', () => {
      expect(() => router.validateJSON(null)).to.throw(Error);
      expect(() => router.validateJSON(undefined)).to.throw(Error);
      expect(() => router.validateJSON('string')).to.throw(Error);
      expect(() => router.validateJSON(123)).to.throw(Error);
    });
  });

  describe('Route Registration', () => {
    it('should register valid route', () => {
      const handler = (req, res) => {};

      router.get('/test', handler);
      router.post('/test', handler);
      router.put('/test', handler);
      router.delete('/test', handler);

      expect(router.routes).to.have.lengthOf(4);
    });

    it('should throw error for invalid route registration', () => {
      expect(() => router.get('invalid-path', () => {})).to.throw(Error);
      expect(() => router.post('/valid-path', 'not-a-function')).to.throw(
        Error
      );
    });
  });

  describe('Route Handling', () => {
    it('should handle existing route', (done) => {
      router.get('/test', (req, res) => {
        router.sendHTML(res, '<h1>Test</h1>');
      });

      const mockReq = { method: 'GET', url: '/test' };
      const mockRes = {
        setHeader: () => {},
        end: (content) => {
          expect(content).to.equal('<h1>Test</h1>');
          done();
        }
      };

      router.handle(mockReq, mockRes);
      done();
    });

    it('should return 404 for non-existent route', (done) => {
      const mockReq = { method: 'GET', url: '/non-existent' };
      const mockRes = {
        statusCode: 200,
        setHeader: () => {},
        end: (content) => {
          expect(mockRes.statusCode).to.equal(404);
          expect(content).to.equal('<h1>404 Not Found</h1>');
          done();
        }
      };

      router.handle(mockReq, mockRes);
      done();
    });
  });

  describe('Method Not Allowed Handling', () => {
    it('should return 405 when path exists but method is not allowed', (done) => {
      router.get('/test', (req, res) => {
        router.sendHTML(res, '<h1>Test</h1>');
      });

      const mockReq = { method: 'POST', url: '/test' };
      const mockRes = {
        statusCode: 200,
        headers: {},
        setHeader: function (name, value) {
          this.headers[name] = value;
        },
        end: function (content) {
          expect(this.statusCode).to.equal(405);
          expect(this.headers['Allow']).to.equal('GET');
          expect(JSON.parse(content)).to.deep.equal({
            error: 'Method Not Allowed'
          });
          done();
        }
      };

      router.handle(mockReq, mockRes);
      done();
    });

    it('should include all allowed methods in Allow header when multiple methods are registered', (done) => {
      const handler = (req, res) => {};

      router.get('/test', handler);
      router.post('/test', handler);
      router.put('/test', handler);

      const mockReq = { method: 'DELETE', url: '/test' };
      const mockRes = {
        statusCode: 200,
        headers: {},
        setHeader: function (name, value) {
          this.headers[name] = value;
        },
        end: function (content) {
          expect(this.statusCode).to.equal(405);
          expect(this.headers['Allow']).to.equal('GET, POST, PUT');
          expect(JSON.parse(content)).to.deep.equal({
            error: 'Method Not Allowed'
          });
          done();
        }
      };

      router.handle(mockReq, mockRes);
      done();
    });

    it('should handle response errors gracefully', (done) => {
      router.get('/test', (req, res) => {
        throw new Error('Handler error');
      });

      const mockReq = { method: 'GET', url: '/test' };
      const mockRes = {
        statusCode: 200,
        headers: {},
        setHeader: function (name, value) {
          this.headers[name] = value;
        },
        end: function (content) {
          expect(this.statusCode).to.equal(500);
          expect(JSON.parse(content)).to.deep.equal({ error: 'Handler error' });
          done();
        }
      };

      router.handle(mockReq, mockRes);
      done();
    });
  });
  describe('getJSON', function () {
    let router;
    let req;
    let res;

    beforeEach(() => {
      router = new Router();
      req = new http.IncomingMessage();
      res = new http.ServerResponse(req);
    });

    it('should parse JSON body correctly', (done) => {
      // Simulate a request with JSON data
      req.push(JSON.stringify({ key: 'value' }));
      req.push(null); // Indicate the end of the request body

      router
        .getJSON(req)
        .then((jsonData) => {
          expect(jsonData).to.deep.equal({ key: 'value' });
          done();
        })
        .catch(done); // Catch any errors and fail the test
    });

    it('should handle empty JSON body', (done) => {
      req.push('');
      req.push(null);

      router
        .getJSON(req)
        .then(() => {
          done(new Error('Expected method to reject.')); // Fail the test if it resolves
        })
        .catch((error) => {
          expect(error).to.be.an('error');
          expect(error.message).to.include('Invalid JSON data');
          done();
        });
    });

    it('should throw an error for invalid JSON', (done) => {
      req.push('{ invalid json }');
      req.push(null);

      router
        .getJSON(req)
        .then(() => {
          done(new Error('Expected method to reject.')); // Fail the test if it resolves
        })
        .catch((error) => {
          expect(error).to.be.an('error');
          expect(error.message).to.include('Invalid JSON data');
          done();
        });
    });
  });
});
