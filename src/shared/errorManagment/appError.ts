export class AppError extends Error {
  public statusCode: number;
  public messageError: string;

  constructor(messageError: string, statusCode: number) {
    super(messageError);
    this.statusCode = statusCode || 500;
    this.messageError = messageError || "Internal Server Error";
    this.name = this.constructor.name;
  }
}
