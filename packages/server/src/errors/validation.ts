export interface IFastifyValidationError {
  statusCode?: number;
  code?: string;
}

export function getFastifyError(error: Error) {
  return error as unknown as IFastifyValidationError;
}
