import * as http from 'http';

import getMaps, { convertMapIntoMeta } from './maps';
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

async function handleMapList(request: ControllerRequest, response: ControllerResponse) {
  const content = JSON.stringify((await getMaps()).map(convertMapIntoMeta));
  response.send(content);
}

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
