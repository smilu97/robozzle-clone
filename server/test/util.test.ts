import * as util from '../src/util';

test('orderByKey', () => {
  const items = [
    { key: 1, value: '1' },
    { key: 2, value: '1' },
    { key: 3, value: '1' },
  ]
  const truth = {
    1: items[0],
    2: items[1],
    3: items[2],
  };
  const result = util.orderByKey(items, 'key');
  expect(result).toStrictEqual(truth);
});

test('readFileAsync', async () => {
  const sampleFile = './puzzles/README.md';
  const buffer = await util.readFileAsync(sampleFile);
  const head = buffer.subarray(0, 5).toString();
  expect(head).toStrictEqual("# Map");
});

test('readFileAsync: wrong filepath', async () => {
  const sampleFile = './puzzles/DONT_README.md';
  await expect(util.readFileAsync(sampleFile)).rejects.toThrow();
});