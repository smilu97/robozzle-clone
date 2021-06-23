export default function shallowCopy<T>(obj: T) {
  if (typeof obj === 'object') return { ...obj };
  return obj;
}
