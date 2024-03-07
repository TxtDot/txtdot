import { Distributor } from './distributor';
import Readability from './engines/readability';
import SearX from './engines/searx';
import StackOverflow from './engines/stackoverflow/main';

const distributor = new Distributor();

distributor.engine(StackOverflow);
distributor.engine(SearX);
distributor.engine(Readability);

export const engineList = distributor.list;
export default distributor;
