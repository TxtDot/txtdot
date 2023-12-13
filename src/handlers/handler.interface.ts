export interface IHandlerOutput {
  content: string;
  textContent: string;
  title?: string;
  lang?: string;
}

export const handlerSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
    },
    textContent: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    lang: {
      type: 'string',
    },
  },
};
