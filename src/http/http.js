import http from 'node:http';
import router from '../router/http.js';

/**
 * Function init for initialize api
 * @param {String} host  the host location api
 * @param {Number} port for number port running api
 */
const init = (host, port) => {
  const server = http.createServer((req, res) => {
    router.handle(req, res);
  });

  server.listen(port, host, () => {
    console.log(`Listerning Server http://localhost:${3000}`);
  });
};
