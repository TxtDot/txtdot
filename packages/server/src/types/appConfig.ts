import { Engine } from '@txtdot/sdk';

type Html2TextConverter = (html: string) => string;

export interface IAppConfig {
  engines: Engine[];
  html2text?: Html2TextConverter;
}
