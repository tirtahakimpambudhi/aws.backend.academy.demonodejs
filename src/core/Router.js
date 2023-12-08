import { Buffer } from 'node:buffer';
/**
 * Router class for handling HTTP requests
 * @class Router
 */
class Router {
  /**
   * Array to store route configurations
   * @type {Array<{method: string, path: string, handler: Function}>}
   * @private
   */
  #routes = [];

  /**
   * Creates a new Router instance
   */

  constructor() {}

  /**
   * Getter method for route
   * @returns {Array<{method: string, path: string, handler: Function}>}
   */
  get routes() {
    return this.#routes;
  }

  /**
   * Validates if the provided path is valid
   * @param {string} path - The route path to validate
   * @throws {Error} If path is invalid
   * @private
   */
  validatePath(path) {
    if (typeof path !== 'string') {
      throw new Error('Path must be a string');
    }

    if (!path.startsWith('/')) {
      throw new Error('Path must start with /');
    }

    const validPathRegex = /^\/[a-zA-Z0-9\-_/]*$/;
    if (!validPathRegex.test(path)) {
      throw new Error('Path contains invalid characters');
    }
  }

  /**
   * Validates if the provided handler is a function
   * @param {Function} handler - The route handler to validate
   * @throws {Error} If handler is invalid
   * @private
   */
  validateHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
  }

  /**
   * Validates if the provided HTML content is valid
   * @param {string} html - The HTML content to validate
   * @throws {Error} If HTML is invalid
   * @private
   */
  validateHTML(html) {
    if (typeof html !== 'string') {
      throw new Error('HTML content must be a string');
    }

    if (!html.trim()) {
      throw new Error('HTML content cannot be empty');
    }

    const hasOpeningTag = /<[a-z][\s\S]*>/i.test(html);
    const hasClosingTag = /<\/[a-z][\s\S]*>/i.test(html);

    if (!hasOpeningTag || !hasClosingTag) {
      throw new Error('Invalid HTML structure');
    }
  }

  /**
   * Validates if the provided JSON data is valid
   * @param {*} data - The data to validate
   * @throws {Error} If JSON data is invalid
   * @private
   */
  validateJSON(data) {
    try {
      JSON.stringify(data);

      if (data === null || data === undefined) {
        throw new Error('JSON data cannot be null or undefined');
      }

      if (typeof data !== 'object') {
        throw new Error('JSON data must be an object or array');
      }
    } catch (error) {
      throw new Error(`Invalid JSON data: ${error.message}`);
    }
  }

  /**
   * Registers a GET route
   * @param {string} path - The route path
   * @param {Function} handler - The route handler
   */
  get(path, handler) {
    this.validatePath(path);
    this.validateHandler(handler);
    this.#routes.push({ method: 'GET', path, handler });
  }

  /**
   * Registers a POST route
   * @param {string} path - The route path
   * @param {Function} handler - The route handler
   */
  post(path, handler) {
    this.validatePath(path);
    this.validateHandler(handler);
    this.#routes.push({ method: 'POST', path, handler });
  }

  /**
   * Registers a PUT route
   * @param {string} path - The route path
   * @param {Function} handler - The route handler
   */
  put(path, handler) {
    this.validatePath(path);
    this.validateHandler(handler);
    this.#routes.push({ method: 'PUT', path, handler });
  }

  /**
   * Registers a DELETE route
   * @param {string} path - The route path
   * @param {Function} handler - The route handler
   */
  delete(path, handler) {
    this.validatePath(path);
    this.validateHandler(handler);
    this.#routes.push({ method: 'DELETE', path, handler });
  }

  /**
   * Handles incoming HTTP requests
   * @param {http.IncomingMessage} req - The request object
   * @param {http.ServerResponse} res - The response object
   */
  async handle(req, res) {
    try {
      const { method, url } = req;
      const route = this.#routes.find(
        (r) => r.method === method && r.path === url
      );

      // Check if path exists but method is different
      const pathExists = this.#routes.some((r) => r.path === url);

      if (route) {
        // If the handler is a promise, await its resolution
        const result = route.handler(req, res);
        if (result instanceof Promise) {
          await result; // Wait for the promise to resolve
        }
      } else if (pathExists) {
        // Return 405 Method Not Allowed if path exists but method doesn't match
        res.statusCode = 405;
        const allowedMethods = this.#routes
          .filter((r) => r.path === url)
          .map((r) => r.method)
          .join(', ');
        res.setHeader('Allow', allowedMethods);
        this.sendJSON(res, { error: 'Method Not Allowed' });
      } else {
        // Return 404 Not Found if path doesn't exist
        res.statusCode = 404;
        this.sendHTML(res, '<h1>404 Not Found</h1>');
      }
    } catch (error) {
      res.statusCode = 500;
      this.sendJSON(res, { error: error.message });
    }
  }

  /**
   * Sends an HTML response
   * @param {http.ServerResponse} res - The response object
   * @param {string} html - The HTML content to send
   */
  sendHTML(res, html) {
    try {
      this.validateHTML(html);
      res.writeHead(res.statusCode, {
        'Content-Type': 'text/html'
      });
      res.end(html);
    } catch (error) {
      res.statusCode = 500;
      res.writeHead(res.statusCode, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ error: error.message }));
    }
  }

  /**
   * Sends a JSON response
   * @param {http.ServerResponse} res - The response object
   * @param {*} data - The data to send as JSON
   */
  sendJSON(res, data) {
    try {
      this.validateJSON(data);
      res.writeHead(data.code, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.statusCode = 500;
      res.writeHead(res.statusCode, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
  /**
   * Get a JSON request body
   * @param {http.IncomingMessage} req The request object
   * @returns {Promise<any>} A promise that resolves to the parsed JSON body
   */
  getJSON(req) {
    return new Promise((resolve, reject) => {
      let body = [];

      req.on('data', (chunk) => {
        body.push(chunk);
      });

      req.on('end', () => {
        body = Buffer.concat(body).toString();
        try {
          const objectBody = JSON.parse(body);
          resolve(objectBody);
        } catch (error) {
          reject(new Error(`Invalid JSON data: ${error.message}`));
        }
      });

      req.on('error', (error) => {
        reject(new Error(`Request error: ${error.message}`));
      });
    });
  }
}

export default Router;
