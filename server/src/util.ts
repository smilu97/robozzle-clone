import * as fs from 'fs';

export function orderByName<T extends {[x: string]: any}, K extends string>(items: T[], key: K) {
  const result: {[x: string]: T} = {};
  for (const item of items) {
    result[item[key]] = item;
  }
  return result;
}

export function readFileAsync(filepath: string) {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
