class Middlewares {
  static notFound(req, res) {
    return res.status(404).send('404 Not Found');
  }
  static asyncWrapper(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res);
      } catch (error) {
        next(error);
      }
    };
  }
  static errorHandler(err, req, res) {
    return res
      .status(500)
      .json({
        message: 'Internal Server Error',
        statusCode: 500,
        description: err,
      });
  }
}
module.exports = Middlewares;
