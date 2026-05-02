const errorHandler = (error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Internal server error.";

  return res.status(statusCode).json({ message });
};

module.exports = {
  errorHandler,
};
