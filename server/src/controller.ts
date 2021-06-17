import * as http from 'http';

import { addRouteRule } from './router';

interface ControllerRequest {
  req: http.IncomingMessage,
  body: Buffer,
}

type Controller = (request: ControllerRequest, response: ControllerResponse) => void;

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

function handleRoot(request: ControllerRequest, response: ControllerResponse) {
  response.send('Hello HTTP!');
}

function register(methods: string[], pattern: RegExp, controller: Controller) {
  addRouteRule(methods, pattern, (request, response) => {
    const req = {
      req: request.req,
      body: request.body,
    };
    const res = new ControllerResponse(response);
    controller(req, res);
  })
}

export default function addControllers() {
  register(['GET'], /\//, handleRoot);
}
