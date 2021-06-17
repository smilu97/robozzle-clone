import * as fs from 'fs';
import * as path from 'path';

type MapDescription = {
  name: string,
  starting: [number, number, number], // Initial [x, y, direction]
  numColors: number,
  writableColors: boolean[],
  tiles: [number, number, number, boolean][], // [x, y, color, hasStar]
  memory: number[], // the size of functions
}

const mapPath = process.env.ROBOZZLE_MAPS || './maps/';
const mapFilenames = fs.readdirSync(mapPath);

let maps: MapDescription[] | undefined = undefined;
const mapWaitingQueue: (() => void)[] = [];

async function readMaps() {
  return Promise.all(
    mapFilenames
      .filter(filename => (/.*\.json/).test(filename))
      .map(filename => path.join(mapPath, filename))
      .map(filepath => new Promise<MapDescription>((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
          if (err) reject(err);
          resolve(JSON.parse(data.toString()));
        });
      }))
  );
}

async function waitLoadingMaps() {
  if (maps !== undefined) return;
  return new Promise<void>((resolve) => {
    mapWaitingQueue.push(resolve);
  });
}

async function getMaps() {
  await waitLoadingMaps();
  return maps;
}

export function convertMapIntoMeta(map: MapDescription) {
  return {
    name: map.name,
  };
}

(async function initialize() {
  maps = await readMaps();
  mapWaitingQueue.forEach(fn => fn());
  console.log('[LOG] Detected maps:', maps.map(i => i.name));
})();

export default getMaps;
