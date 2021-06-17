import * as http from 'http';

import getPuzzles, { convertPuzzleIntoMeta } from './puzzle';
import { addRouteRule } from './router';

interface ControllerRequest {
  req: http.IncomingMessage,
  body: Buffer,
}

type Controller = (request: ControllerRequest, response: ControllerResponse) => Promise<void>;
class ControllerResponse {
  response: http.OutgoingMessage;

  constructor(response: http.OutgoingMessage) {
    this.response = response;
  }

  send(content: string) {
    const chunk = Buffer.from(content);
    this.response.write(chunk, (error: Error) => {
      if (error) {
        console.error('[ERROR][Controller.send]:', error);
      }
    });
  }
}

/**
 * Fetch puzzles, and send list of meta of puzzles
 * @param request 
 * @param response 
 */
async function handleMapList(request: ControllerRequest, response: ControllerResponse) {
  const content = JSON.stringify((await getPuzzles()).map(convertPuzzleIntoMeta));
  response.send(content);
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

register(['GET'], /\/maps/, handleMapList);
