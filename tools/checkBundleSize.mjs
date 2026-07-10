import { gzipSync } from 'node:zlib';
import process from 'node:process';
import { readFileSync } from 'node:fs';

const file = new URL('../scripts/MyNovelReader.user.js', import.meta.url);
const source = readFileSync(file);
const rawLimit = 900 * 1024;
const gzipLimit = 250 * 1024;
const gzipBytes = gzipSync(source).byteLength;

console.log(
  `[bundle] raw ${(source.byteLength / 1024).toFixed(1)} KiB, gzip ${(gzipBytes / 1024).toFixed(1)} KiB`
);

if (source.byteLength > rawLimit || gzipBytes > gzipLimit) {
  console.error('[bundle] size budget exceeded: 900 KiB raw / 250 KiB gzip');
  process.exitCode = 1;
}
