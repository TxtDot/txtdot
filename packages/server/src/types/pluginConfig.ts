import { Engine, Middleware } from '@txtdot/sdk';

type Html2TextConverter = (html: string) => string;

export interface IAppConfig {
  /**
   * List of engines, ordered
   */
  engines: Engine[];
  /**
   * List of middlewares, ordered
   */
  middlewares?: Middleware[];
  /**
   * HTML to text converter, if engine doesn't support text
   */
  html2text?: Html2TextConverter;
}
