import * as http from 'http';

import { addRouteRule } from '../router';

export interface ControllerRequest {
  req: http.IncomingMessage,
  body: Buffer,
}

export class ControllerResponse {
  response: http.ServerResponse;

  constructor(response: http.ServerResponse) {
    this.response = response;
  }

  send(data: string | Object, statusCode: number = 200) {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    const chunk = Buffer.from(content);
    this.response.write(chunk, (error: Error) => {
      if (error) {
        console.error('[ERROR][Controller.send]:', error);
      }
    });
    this.response.statusCode = statusCode;
  }
}

type Controller = (request: ControllerRequest, response: ControllerResponse) => Promise<void>;

/**
 * Add rules in './router.ts'
 * @param methods Whitelist of methods
 * @param pattern regular expression to test URL
 * @param controller
 */
export function register(methods: string[], pattern: RegExp, controller: Controller) {
  addRouteRule(methods, pattern, async (request, response) => {
    const req = {
      req: request.req,
      body: request.body,
    };
    const res = new ControllerResponse(response);
    await controller(req, res);
  })
}
