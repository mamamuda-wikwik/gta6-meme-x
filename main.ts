// main.ts — "Vice City Rent", a GTA 6 meme for make.fun gta6-meme-x-01
//
// Validates the meme image meme.png next to this script and copies it
// into an output directory: the first argument when given, /output
// otherwise (the grader runs `node /bot/main.ts` with no arguments and
// mounts an empty writable directory at /output).
//
// Usage: node main.ts ./out
//
// The checks are strict on purpose: the file must be a real PNG with a
// 13-byte IHDR chunk, an IEND trailer, exactly 1200x675 pixels, and a
// total size of at most 8 MiB. Anything else fails loudly and nothing
// is copied.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 8 * 1024 * 1024;
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 675;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // No argument: the grader's sandbox run passes none, so default to
  // /output; a directory given on the command line still wins.
  const outDir = process.argv[2] ?? "/output";

  // meme.png lives next to this script. Resolve it from the script's own
  // location: import.meta.url works under Node's TypeScript stripping,
  // where __dirname does not exist, and the working directory is not
  // reliable (the grader runs from elsewhere).
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const source = join(scriptDir, "meme.png");
  if (!existsSync(source)) {
    fail(`meme.png not found next to main.ts (${source})`);
  }

  const size = statSync(source).size;
  if (size > MAX_BYTES) {
    fail(`meme.png is ${size} bytes, over the 8 MiB limit`);
  }

  const data = readFileSync(source);
  if (data.length < 8 || !data.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("meme.png is not a PNG file (bad signature)");
  }

  // First chunk must be IHDR and its length field must read exactly 13.
  if (data.length < 25) {
    fail("meme.png is too short to hold a PNG header");
  }
  const firstLength = data.readUInt32BE(8);
  const firstType = data.subarray(12, 16).toString("ascii");
  if (firstType !== "IHDR" || firstLength !== 13) {
    fail("meme.png does not start with a 13-byte IHDR chunk");
  }

  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    fail(`meme.png is ${width}x${height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
  }

  // IHDR fields: 8-bit samples, RGB colour type (2). Anything else is not
  // the image this entry ships.
  const bitDepth = data[24];
  const colorType = data[25];
  if (bitDepth !== 8 || colorType !== 2) {
    fail(`meme.png IHDR says bit depth ${bitDepth}, colour type ${colorType}; expected 8-bit RGB`);
  }

  // Last chunk must be IEND: its 12 bytes are a zero length, the type,
  // and the CRC — so the type sits 8..4 bytes from the end.
  const lastType = data.subarray(data.length - 8, data.length - 4).toString("ascii");
  if (lastType !== "IEND") {
    fail("meme.png has no IEND trailer");
  }

  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, "meme.png");
  copyFileSync(source, dest);
  console.log(`meme.png: ${width}x${height}, ${size} bytes -> ${dest}`);
}

main();
