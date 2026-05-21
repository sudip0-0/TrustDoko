export class PermissionError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export function forbidden(message: string): never {
  throw new PermissionError(message);
}
