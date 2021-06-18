import * as util from '../src/util';

interface OrderByKeyTestItem {
  key: number;
  value: string;
  sym: symbol;
  obj: object;
}

type OrderByKeyTestItemKeys =
  keyof OrderByKeyTestItem;

test('orderByKey', () => {
  const items: OrderByKeyTestItem[] = [
    { key: 1, value: '1', sym: Symbol(), obj: { a: 1, } },
    { key: 2, value: '2', sym: Symbol(), obj: { a: 2, } },
    { key: 3, value: '3', sym: Symbol(), obj: { a: 3, } },
  ];

  const expectResult =
    (key: OrderByKeyTestItemKeys) =>
      expect(util.orderByKey(items, key));

  expectResult('key').toStrictEqual({
    1: items[0],
    2: items[1],
    3: items[2],
  });
  expectResult('value').toStrictEqual({
    '1': items[0],
    '2': items[1],
    '3': items[2],
  });

  expectResult('sym').toThrowError();
  expectResult('obj').toThrowError();
});

test('readFileAsync', async () => {
  const sampleFile = './puzzles/README.md';
  const buffer = await util.readFileAsync(sampleFile);
  const head = buffer.subarray(0, 5).toString();
  expect(head).toStrictEqual("# Map");
});

test('readFileAsync: wrong filepath', async () => {
  const sampleFile = './puzzles/DONT_README.md';
  try {
    await util.readFileAsync(sampleFile);
    expect(true).toBeFalsy();
  } catch (e) {
    expect(true).toBeTruthy();
  }
});
