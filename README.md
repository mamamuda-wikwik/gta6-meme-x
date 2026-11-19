# Vice City Rent — a GTA 6 meme

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/mamamuda-wikwik/gta6-meme-x/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/mamamuda-wikwik/gta6-meme-x/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

## The joke

Lucia & Jason just pulled off the biggest bank heist in GTA 6 — a duffel
bag stuffed with cash, neon Vice City glowing behind them, living the
dream. The punchline: the whole haul only covers two weeks of rent in
Vice City.

Top caption: "LUCIA & JASON AFTER ROBBING A BANK IN GTA 6"
Bottom caption: "THE CASH ONLY COVERS 2 WEEKS RENT IN VICE CITY"

## How to run it

Requires Node.js (no packages, no network — standard library only).

```sh
node main.ts ./out
```

The program checks `meme.png` first: it must be a genuine PNG with a
13-byte IHDR chunk, an 8-bit RGB colour type, an IEND trailer, exactly
1200x675 pixels, and no more than 8 MiB. If anything fails, it prints an
error, exits with a non-zero code, and copies nothing. On success it
copies the image to `./out/meme.png` and prints a one-line summary.

To rebuild the meme from its illustration, run the composer (Python 3
with Pillow, no network):

```sh
python3 render.py
```

It draws the two captions over `assets/illustration.png` and writes
`meme.png` next to itself, deterministically.

## Files

- `meme.png` — the meme itself, 1200x675.
- `main.ts` — the validator and copier (Node.js, standard library only).
- `render.py` — the script that composed the meme: illustration plus
  classic top/bottom captions (PIL only, deterministic).
- `assets/illustration.png` — the Vice City illustration render.py draws
  the captions over.
- `POST.json` — the X post carrying the meme, as
  {"url": "https://x.com/simont0k/status/<id>"}.
- `README.md` — this file.
- `LICENSE` — MIT license.

## Posting on X

The meme only counts once it is posted publicly on X from @simont0k:

- Post after the bounty opened (2026-11-19 14:00 UTC) and before it closes
  (2026-11-23 14:00 UTC), with `meme.png` attached.
- The post text must carry `make.fun` (a link to the bounty) or tag
  `@makefunai`, plus one of the entrant's play codes.
- Keep the post public and undeleted until the results are out
  (2026-12-08). Then write its URL into `POST.json` as
  {"url": "https://x.com/simont0k/status/<id>"} and submit the new commit.

## Referral

Referral code `tdgxqn9n` is tied to this entry.
