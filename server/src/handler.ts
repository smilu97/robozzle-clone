import * as http from 'http';
import * as stream from 'stream';

import route from './router';

function clientErrorEventHandler(_err: Error, socket: stream.Duplex) {
  socket.end('HTTP/1.1 400 Bad request\r\n\r\n');
}

function errorEventHandler(err: Error) {
  console.error('[ERROR][errorEventHandler]: ', err);
}

export default function requestHandler(request: http.IncomingMessage, response: http.OutgoingMessage) {
  console.log('[LOG] Request URL:', request.url, 'on', Date.now());

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
