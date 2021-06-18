import * as fs from 'fs';

export function orderByKey<
  T extends { [key in string | number]: any },
  K extends keyof T,
>(
  items: T[],
  key: K,
) {
  if (typeof items[0][key] !== 'string' && typeof items[0][key] !== 'number') {
    throw new Error();
  }

  const result = items.reduce<Record<T[K], T> | undefined>((acc, item) => {
    if (acc === undefined) {
      const temp = { [item[key]]: item };
      return temp;
    }

    acc[item[key]] = item;
    return acc;
  }, undefined);

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
