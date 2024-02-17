import { Distributor } from './distributor';
import Readability from './engines/readability';
import SearX from './engines/searx';
const distributor = new Distributor();

distributor.engine(Readability);
distributor.engine(SearX);

// export const engines: Engines = {
//   readability,
//   google,
//   stackoverflow,
//   searx,
// };

// export const engineList: string[] = Object.keys(engines);

// export const fallback: EnginesMatch = [
//   {
//     pattern: GoogleDomains,
//     engine: engines.google,
//   },
//   {
//     pattern: StackOverflowDomains,
//     engine: engines.stackoverflow,
//   },
//   {
//     pattern: SearxDomains,
//     engine: engines.searx,
//   },
// ];

export const engineList = distributor.list;
export default distributor;
