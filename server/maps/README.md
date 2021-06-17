# Map protocol

```javascript
type MapDescription = {
  name: string,
  starting: [number, number, number], // Initial [x, y, direction]
  numColors: number,
  writableColors: boolean[],
  tiles: [number, number, number, boolean][], // [x, y, color, hasStar]
  memory: number[], // the size of functions
}
```
