function handleError(res, exception) {
  let statusCode = exception && exception.status ? exception.status : 500;

  res
    .status(statusCode)
    .json({ ok: false, message: exception.errors || exception.message });
}

module.exports = { handleError };
