import origAxios, { CreateAxiosDefaults } from 'axios';
import { isLocalResource, isLocalResourceURL } from '../utils/islocal';
import { LocalResourceError } from '../errors/main';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: CreateAxiosDefaults<any> = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
  },
  responseType: 'stream',
};

const axios = origAxios.create(config);

axios.interceptors.response.use(
  (response) => {
    if (isLocalResource(response.request.socket.remoteAddress)) {
      throw new LocalResourceError();
    }

    return response;
  },
  async (error) => {
    if (await isLocalResourceURL(new URL(error.config?.url))) {
      throw new LocalResourceError();
    }

    throw error;
  }
);

/**
 * Modified axios for blocking local resources
 */
export default axios;

/**
 *  Original axios
 */
export const oaxios = origAxios.create(config);
