import * as http from 'http';

const server = http.createServer((request, response) => {
  console.log('Received a request');
});
