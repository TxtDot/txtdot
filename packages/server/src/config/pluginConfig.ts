import { IAppConfig } from '../types/pluginConfig';
import { engineList, middlewareList, html2text } from '@txtdot/plugins';

/**
 * Configuration of plugins
 * Here you can add your own plugins
 */
const plugin_config: IAppConfig = {
  engines: [...engineList],
  middlewares: [...middlewareList],
  html2text,
};

export default plugin_config;
