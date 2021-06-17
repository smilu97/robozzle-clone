import * as http from 'http';

import requestHandler from './handler';
import './controller';

const port = process.env.PORT || 8080;
const server = http.createServer(requestHandler);
server.listen(port, () => {
  console.log(`🚀 Server application started at ${port} port`);
});
