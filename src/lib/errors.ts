export class PublicApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicApiError";
  }
}
