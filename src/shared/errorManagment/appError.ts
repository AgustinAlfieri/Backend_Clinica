import { error } from "winston";

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

export function resolveMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Unknown error';
  }
}
