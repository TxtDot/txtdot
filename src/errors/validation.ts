export interface IFastifyValidationError {
  statusCode?: number;
  code?: string;
  validation?: any;
}

export function getFastifyError(error: Error) {
  return error as unknown as IFastifyValidationError;
}
