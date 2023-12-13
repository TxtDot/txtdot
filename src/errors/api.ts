export interface IApiError {
  code: number;
  name: string;
  message: string;
}

export const errorSchema = {
  type: "object",
  properties: {
    code: {
      type: "number",
      description: "HTTP error code",
    },
    name: {
      type: "string",
      description: "Exception class name",
    },
    message: {
      type: "string",
      description: "Exception message",
    },
  },
};

export const errorResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      nullable: true,
    },
    error: errorSchema,
  },
};
