import * as http from 'http';

import { addRouteRule, RouteRequest } from '../router';

export interface ControllerRequest {
  req: http.IncomingMessage,
  body: Buffer,
}

export class ControllerResponse {
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

type Controller = (request: ControllerRequest, response: ControllerResponse) => Promise<void>;

function buildRouteHandler(controller: Controller) {
  return async (request: RouteRequest, response: http.ServerResponse) => {
    const req = {
      req: request.req,
      body: request.body,
    };
    const res = new ControllerResponse(response);
    await controller(req, res);
  };
}

/**
 * Add rules in './router.ts'
 * @param methods Whitelist of methods
 * @param pattern regular expression to test URL
 * @param controller
 */
export function register(methods: string[], pattern: RegExp, controller: Controller) {
  addRouteRule(methods, pattern, buildRouteHandler(controller));
}
