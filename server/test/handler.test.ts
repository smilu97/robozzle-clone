import * as http from 'http';

import handle from '../src/handler';

jest.mock('../src/router'); 
import route from '../src/router';

const mockedRoute = route as jest.Mock<Promise<void>>;

test('request handler', async () => {
  let flag = 0;
  const response = {} as http.ServerResponse;
  mockedRoute.mockImplementation(async (_req: any, res: any) => {
    console.log('mock');
    expect(res).toBe(response);
    flag |= 0b01;
  });
  const request = {
    url: '/test',
    on(eventName: string, handler: (...args: any[]) => void) {
      switch (eventName) {
        case 'data':
          flag |= 0b10;
          handler(Uint8Array.from([1, 2, 3]));
          break;
        case 'end':
          flag |= 0b100;
          handler();
          break;
        case 'error':
          flag |= 0b1000;
          handler();
          break;
        case 'clientError':
          flag |= 0b10000;
          handler(null, { end: () => {} });
          break;
      }
      return request;
    },
  } as http.IncomingMessage;
  handle(request, response);
  expect(flag).toBe(0b11111);
});
