import { IAppConfig } from '../types/pluginConfig';
import { engineList } from '@txtdot/plugins';
import { compile } from 'html-to-text';

/**
 * Configuration of plugins
 * Here you can add your own plugins
 */
const plugin_config: IAppConfig = {
  engines: [...engineList],
  html2text: compile(),
};

export default plugin_config;
