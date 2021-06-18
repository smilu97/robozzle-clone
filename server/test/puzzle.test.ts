import * as puzzle from '../src/puzzle';

test('Load sample tutorial puzzle', async () => {
  const puz = await puzzle.getPuzzleByName('tutorial');
  expect(puz).not.toBeFalsy();
});

test('Load sample tutorial puzzle', async () => {
  const puz = await puzzle.default();

  expect(puz).toHaveProperty('length');
  expect(puz[0]).toHaveProperty('name');
});

test('Convert puzzle into metadata', () => {
  const target = {
    name: 'test',
    dummy: 4,
  } as any;
  const meta = puzzle.convertPuzzleIntoMeta(target);
  expect(meta).toHaveProperty('name', 'test');
  expect(meta).not.toHaveProperty('dummy');
});
