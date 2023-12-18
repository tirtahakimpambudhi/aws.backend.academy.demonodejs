import Router from '../core/Router.js';
import Users from '../db/Users.js';

const DB = new Users();
const router = new Router();

router.get('/api/v1/users', (req, res) => {
  router.sendJSON(res, {
    code: 200,
    status: 'STATUS_OK',
    data: DB.getAll()
  });
});

router.post('/api/v1/users', (req, res) => {
  router
    .getJSON(req)
    .then((user) => {
      DB.create(user);
      return router.sendJSON(res, {
        code: 201,
        status: 'STATUS_CREATED',
        data: user
      });
    })
    .catch((error) => {
      const statusCode =
        error.message.includes('Invalid JSON data') ||
        error.message.includes('The argument is not a valid User class')
          ? 400
          : 500;
      router.sendJSON(res, {
        code: statusCode,
        status: statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
        errors: [error.message]
      });
    });
});

router.put('/api/v1/users', (req, res) => {
  try {
    router
      .getJSON(req)
      .then((data) => {
        DB.update(data.id, data.user);
        return router.sendJSON(res, {
          code: 200,
          status: 'STATUS_OK',
          data: data
        });
      })
      .catch((error) => {
        const statusCode =
          error.message.includes('Invalid JSON data') ||
          error.message.includes('The argument is not a valid User class')
            ? 400
            : 500;
        router.sendJSON(res, {
          code: statusCode,
          status: statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
          errors: [error.message]
        });
      });
  } catch (error) {
    const statusCode = error.message.includes('Invalid JSON data') ? 400 : 500;
    router.sendJSON(res, {
      code: statusCode,
      status: statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
      errors: [error.message]
    });
  }
});

router.delete('/api/v1/users', (req, res) => {
  router
    .getJSON(req)
    .then((data) => {
      DB.delete(data.id);
      return router.sendJSON(res, {
        code: 200,
        status: 'STATUS_OK',
        data: null
      });
    })
    .catch((error) => {
      const statusCode =
        error.message.includes('Invalid JSON data') ||
        error.message.includes('The argument is not a valid User class')
          ? 400
          : 500;
      router.sendJSON(res, {
        code: statusCode,
        status: statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
        errors: [error.message]
      });
    });
});
export default router;
