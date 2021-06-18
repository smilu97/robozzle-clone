import * as http from 'http';
import * as stream from 'stream';

import route from './router';

const URLLoggingBlacklist = ['/favicon.ico'];

/**
 * Client error event handler
 * @param _err error
 * @param socket 
 */
function clientErrorEventHandler(_err: Error, socket: stream.Duplex) {
  socket.end('HTTP/1.1 400 Bad request\r\n\r\n');
}

/**
 * Error event handler
 * @param err error
 */
function errorEventHandler(err: Error) {
  if (process.env.NODE_ENV !== 'test')
    console.error('[ERROR][errorEventHandler]: ', err);
}

/**
 * Handle all requests which is parsed by 'http' module from outside
 * This is the entry point from 'http' module into user code
 * @param request HTTP request
 * @param response HTTP response
 */
export default function requestHandler(request: http.IncomingMessage, response: http.ServerResponse) {
  if (request.url && !URLLoggingBlacklist.includes(request.url)) {
    console.log('[LOG] Request URL:', request.url, 'on', Date.now());
  }

  // Container for stacking up chunks from request body
  const chunks: Uint8Array[] = [];

  const dataEventHandler = (chunk: Uint8Array) => {
    chunks.push(chunk);
  };

  const endEventHandler = () => {
    const body = Buffer.concat(chunks);
    route({ req: request, body }, response);
  };

  request
    .on('data', dataEventHandler)
    .on('end', endEventHandler)
    .on('error', errorEventHandler)
    .on('clientError', clientErrorEventHandler);
}
