import dyn_config from './dynConfig';
import env_config from './envConfig';
import package_config from './packageConfig';
import plugin_config from './pluginConfig';

const config = {
  dyn: dyn_config,
  env: env_config,
  plugin: plugin_config,
  package: package_config,
};

export default config;
