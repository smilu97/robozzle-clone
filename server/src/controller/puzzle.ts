import getPuzzles, { convertPuzzleIntoMeta, getPuzzleByName } from '../puzzle';
import { ControllerRequest, ControllerResponse } from '.';

/**
 * GET /maps
 * Fetch puzzles, and send list of meta of puzzles
 * @param request 
 * @param response 
 */
export async function handleMapList(request: ControllerRequest, response: ControllerResponse) {
  const puzzles = await getPuzzles();
  if (puzzles === undefined) return;

  response.send(puzzles.map(convertPuzzleIntoMeta));
}

/**
 * GET /map/:mapName
 * @param request
 * @param response
 */
export async function handleMapDescription(request: ControllerRequest, response: ControllerResponse) {
  const name = request.req.url?.substr('puzzle'.length + 2) ?? '';
  const puzzle = await getPuzzleByName(name);

  if (puzzle === undefined)
    return response.send({ message: 'Puzzle Not Found' }, 404);
  
  response.send(puzzle);
}