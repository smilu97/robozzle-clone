import * as http from 'http';

import getPuzzles, { convertPuzzleIntoMeta, getPuzzleByName } from './puzzle';
import { addRouteRule } from './router';

interface ControllerRequest {
  req: http.IncomingMessage,
  body: Buffer,
}

type Controller = (request: ControllerRequest, response: ControllerResponse) => Promise<void>;
class ControllerResponse {
  response: http.ServerResponse;

  constructor(response: http.ServerResponse) {
    this.response = response;
  }

  send(data: string | Record<string, unknown> | unknown[], statusCode: number = 200) {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    const chunk = Buffer.from(content);
    this.response.write(chunk, (error: Error | null | undefined) => {
      if (error) {
        console.error('[ERROR][Controller.send]:', error);
      }
    });
    this.response.statusCode = statusCode;
  }
}

/**
 * Fetch puzzles, and send list of meta of puzzles
 * @param request 
 * @param response 
 */
async function handleMapList(request: ControllerRequest, response: ControllerResponse) {
  const puzzles = await getPuzzles();
  
  if (puzzles) {
    response.send(puzzles.map(convertPuzzleIntoMeta));
  }
}

async function handleMapDescription(request: ControllerRequest, response: ControllerResponse) {
  const name = request.req.url?.substr('puzzle'.length + 2) ?? '';
  const puzzle = await getPuzzleByName(name);

  if (puzzle === undefined)
    return response.send({ message: 'Puzzle Not Found' }, 404);
  
  response.send(puzzle);
}

/**
 * Add rules in './router.ts'
 * @param methods Whitelist of methods
 * @param pattern regular expression to test URL
 * @param controller
 */
function register(methods: string[], pattern: RegExp, controller: Controller) {
  addRouteRule(methods, pattern, async (request, response) => {
    const req = {
      req: request.req,
      body: request.body,
    };
    const res = new ControllerResponse(response);
    await controller(req, res);
  })
}

register(['GET'], /\/puzzles/, handleMapList);
register(['GET'], /\/puzzle\/.*/, handleMapDescription);
