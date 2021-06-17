import * as fs from 'fs';
import * as path from 'path';

type PuzzleDescription = {
  name: string,
  starting: [number, number, number], // Initial [x, y, direction]
  numColors: number,
  writableColors: boolean[],
  tiles: [number, number, number, boolean][], // [x, y, color, hasStar]
  memory: number[], // the size of functions
}

const puzzlePath = process.env.ROBOZZLE_PUZZLES || './puzzles/';
const puzzleFilenames = fs.readdirSync(puzzlePath);

let puzzles: PuzzleDescription[] | undefined = undefined;
const waitings: (() => void)[] = [];

async function readAll() {
  return Promise.all(
    puzzleFilenames
      .filter(filename => (/.*\.json/).test(filename))
      .map(filename => path.join(puzzlePath, filename))
      .map(filepath => new Promise<PuzzleDescription>((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
          if (err) reject(err);
          resolve(JSON.parse(data.toString()));
        });
      }))
  );
}

async function waitLoading() {
  if (puzzles !== undefined) return;
  return new Promise<void>((resolve) => {
    waitings.push(resolve);
  });
}

export function convertPuzzleIntoMeta(puz: PuzzleDescription) {
  return {
    name: puz.name,
  };
}

(async function initialize() {
  puzzles = await readAll();
  waitings.forEach(fn => fn());
  console.log('[LOG] Detected puzzles:', puzzles.map(i => i.name));
})();

export default async function getPuzzles() {
  await waitLoading();
  return puzzles;
}
