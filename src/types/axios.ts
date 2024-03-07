import origAxios from 'axios';
import { isLocalResource, isLocalResourceURL } from '../utils/islocal';
import { LocalResourceError } from '../errors/main';

const axios = origAxios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
  },
  responseType: 'stream',
});

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

export default axios;
