import * as http from 'http';

export interface RouteRequest {
  req: http.IncomingMessage;
  body: Buffer;
};

export type RouteRuleHandler = (request: RouteRequest, response: http.OutgoingMessage) => void;

export interface RouteRule {
  methods?: string[];
  pattern: RegExp;
  handler: RouteRuleHandler;
}

const rules: RouteRule[] = [];

export function addRouteRule(methods: string[], pattern: RegExp, handler: RouteRuleHandler) {
  rules.push({ methods, pattern, handler });
}

/**
 * Route function reads `rules` to find proper pair which matches with URL of request
 */
export default function route(request: RouteRequest, response: http.OutgoingMessage) {
  const { url, method } = request.req;

  if (url === undefined) {
    response.end();
    return;
  }

  for (const rule of rules) {
    if (false === rule.pattern.test(url)) continue;
    if (rule.methods !== undefined && rule.methods.indexOf(method) == -1) continue;
    rule.handler(request, response);
    break;
  }
  response.end();
}
