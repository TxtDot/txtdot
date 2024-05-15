import { Distributor } from './distributor';
import plugin_config from './config/pluginConfig';

const distributor = new Distributor();

for (const engine of plugin_config.engines) {
  distributor.engine(engine);
}

for (const middleware of plugin_config.middlewares || []) {
  distributor.middleware(middleware);
}

export const engineList = distributor.engines_list;
export { distributor };
