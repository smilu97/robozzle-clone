import * as http from 'http';

export interface RouteRequest {
  req: http.IncomingMessage;
  body: Buffer;
};

export type RouteRuleHandler =
  (request: RouteRequest, response: http.ServerResponse) => Promise<void>;

export interface RouteRule {
  methods?: string[];
  pattern: RegExp;
  handler: RouteRuleHandler;
}

// Items are added in rules by './controller.ts'
export const rules: RouteRule[] = [];

/**
 * Add a new rule
 * @param methods Whitelist of methods
 * @param pattern Regular expression to test URL
 * @param handler handler function
 */
export function addRouteRule(methods: string[], pattern: RegExp, handler: RouteRuleHandler) {
  rules.push({ methods, pattern, handler });
}

/**
 * Route function reads `rules` to find proper pair which matches with URL of request
 * @param request 
 * @param response
 */
export default async function route(request: RouteRequest, response: http.ServerResponse) {
  const { url, method } = request.req;

  if (url === undefined) {
    return response.end();
  }

  if (method === undefined) {
    return response.end();
  }

  response.setHeader('Accept', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTION');

  for (const rule of rules) {
    if (false === rule.pattern.test(url)) continue;
    if (rule.methods && !rule.methods.includes(method)) continue;
    await rule.handler(request, response);
    break;
  }

  response.end();
}
