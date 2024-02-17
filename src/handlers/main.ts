import { Distributor } from './distributor';
import Readability from './engines/readability';
import SearX from './engines/searx';
import StackOverflow from './engines/stackoverflow';

const distributor = new Distributor();

distributor.engine(Readability);
distributor.engine(SearX);
distributor.engine(StackOverflow);

export const engineList = distributor.list;
export default distributor;
