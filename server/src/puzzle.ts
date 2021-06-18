import * as fs from 'fs';
import * as path from 'path';

import { orderByKey, readFileAsync } from './util';

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
let puzzleByName: {[x: string]: PuzzleDescription} | undefined = undefined;
const waitings: (() => void)[] = [];

/**
 * Read all puzzle description from disc
 * @returns List of promise of puzzle descriptions
 */
async function readAll() {
  return Promise.all(
    puzzleFilenames
      .filter(filename => (/.*\.json/).test(filename))
      .map(filename => path.join(puzzlePath, filename))
      .map(readFileAsync)
  ).then(buffers => buffers
    .map(buffer => buffer.toString())
    .map(raw => JSON.parse(raw) as PuzzleDescription)
  );
}

/**
 * Wait until reading all puzzles is done
 */
async function waitLoading() {
  if (puzzles !== undefined) return;
  return new Promise<void>((resolve) => {
    waitings.push(resolve);
  });
}

/**
 * Remain only metadata of puzzle description
 * @param puz puzzle description
 * @returns metadata of puzzle
 */
export function convertPuzzleIntoMeta(puz: PuzzleDescription) {
  return {
    name: puz.name,
  };
}

(async function initialize() {
  puzzles = await readAll();
  puzzleByName = orderByKey(puzzles, 'name');
  waitings.forEach(fn => fn());
  console.log('[LOG] Detected puzzles:', puzzles.map(i => i.name));
})();

/**
 * Get puzzle description by target puzzle name
 * @param name 
 * @returns puzzle description
 */
export async function getPuzzleByName(name: string) {
  await waitLoading();
  return puzzleByName?.[name] ?? {};
}

export default async function getPuzzles() {
  await waitLoading();
  return puzzles;
}
