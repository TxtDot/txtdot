import { IAppConfig } from '../types/appConfig';
import { engineList } from '@txtdot/plugins';

/**
 * Configuration of plugins
 * Here you can add your own plugins
 */
const plugin_config: IAppConfig = {
  engines: [...engineList],
};

export default plugin_config;
