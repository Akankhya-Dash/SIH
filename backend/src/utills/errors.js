export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(err, req, res, _next) {
  console.error(err);
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal Server Error" });
}
