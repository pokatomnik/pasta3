export abstract class HTTPError extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export class NotFoundError extends HTTPError {
  public constructor(code: string, message: string) {
    super(404, code, message);
  }
}

export class UnauthorizedError extends HTTPError {
  public constructor(code: string, message: string) {
    super(403, code, message);
  }
}

export class InvalidRequesterror extends HTTPError {
  public constructor(code: string, message: string) {
    super(400, code, message);
  }
}

export class ServerError extends HTTPError {
  public constructor(code: string, message: string) {
    super(500, code, message);
  }
}
