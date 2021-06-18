import * as http from 'http';
import * as router from '../src/router';

function mockRequest(method: string, url?: string) {
  return {
    req: { url, method } as http.IncomingMessage,
    body: Buffer.from('DEADBEEF'),
  } as router.RouteRequest;
}

function mockResponse(endFn: () => void) {
  return { end: endFn } as http.ServerResponse;
}

test('add router', () => {
  const handler = async () => {};
  router.addRouteRule(['GET'], /\/qwer/, handler);
  expect(router.rules[0]).toStrictEqual({
    methods: ['GET'],
    pattern: /\/qwer/,
    handler,
  });
});

test('router should end response if url is empty', async () => {
  let flag = 0;
  const request = mockRequest('GET', undefined);
  const response = mockResponse(() => {
    if (flag & 0b01)
      throw new Error('response.end() was called twice');
    flag |= 1;
  });
  await router.default(request, response);
  expect(flag).toBe(0b01);
});

test('router should find proper rule', async () => {
  let flag = 0;
  const failure = async () => { throw new Error(); };
  const success = async () => {
    if (flag & 0b01)
      throw new Error('handler was called twice');
    flag |= 0b01;
  };
  router.rules.push({ methods: ['GET'],  pattern: /\/abc/, handler: failure });
  router.rules.push({ methods: ['POST'], pattern: /\/cde/, handler: failure });
  router.rules.push({ methods: ['GET'],  pattern: /\/cde/, handler: success });
  router.rules.push({ methods: ['GET'],  pattern: /\/cde/, handler: failure });
  const request = {
    req: {
      url: '/cde',
      method: 'GET',
    } as http.IncomingMessage,
    body: Buffer.from('DEADBEEF'),
  };
  const response = {
    end: () => {
      if (flag & 0b10)
        throw new Error('response.end() was called twice');
      flag |= 0b10;
    },
  } as http.ServerResponse;
  await router.default(request, response);
  expect(flag).toBe(0b11);
});
