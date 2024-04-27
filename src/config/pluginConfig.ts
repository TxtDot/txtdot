import { IAppConfig } from '../types/appConfig';
import { engines } from '@txtdot/plugins';

/**
 * Configuration of plugins
 * Here you can add your own plugins
 */
const plugin_config: IAppConfig = {
  engines: [engines.StackOverflow, engines.SearX, engines.Readability],
};

export default plugin_config;
