import { AppError } from "./AppError";

export class ValidationError extends AppError {
  errors: any;

  constructor(errors: any) {
    super("Validation error", 400);
    this.errors = errors;
  }
}
