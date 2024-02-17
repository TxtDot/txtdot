import { Distributor } from './distributor';
import Readability from './engines/readability';
import SearX from './engines/searx';
const distributor = new Distributor();

distributor.engine(Readability);
distributor.engine(SearX);

export const engineList = distributor.list;
export default distributor;
