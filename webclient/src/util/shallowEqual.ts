export default function shallowEqual<T>(v1: T, v2: T) {
    if (typeof v1 !== 'object') return v1 === v2;
    for (let key in v1) {
        if (v1[key] !== v2[key]) return false;
    }
    return true;
  }
  