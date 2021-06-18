import * as http from 'http';

import requestHandler from './handler';

import { register } from './controller';
import { handleMapDescription, handleMapList } from './controller/puzzle';

const port = process.env.PORT || 8080;
const server = http.createServer(requestHandler);

register(['GET'], /\/puzzles/, handleMapList);
register(['GET'], /\/puzzle\/.*/, handleMapDescription);

server.listen(port, () => {
  console.log(`🚀 Server application started at ${port} port`);
});
