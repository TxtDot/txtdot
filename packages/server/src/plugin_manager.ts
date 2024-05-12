import { Distributor } from './distributor';
import plugin_config from './config/pluginConfig';

const distributor = new Distributor();

for (const engine of plugin_config.engines) {
  distributor.engine(engine);
}

export const engineList = distributor.list;
export { distributor };
