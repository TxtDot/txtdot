import { Distributor } from './distributor';
import { engines } from '@txtdot/plugins';

const distributor = new Distributor();

distributor.engine(engines.StackOverflow);
distributor.engine(engines.SearX);
distributor.engine(engines.Readability);

export const engineList = distributor.list;
export default distributor;
