#!/usr/bin/env python3
"""Compose the "Vice City Rent" GTA 6 meme: illustration + classic top/bottom
caption text, PIL only. No network, fully deterministic.

Reads assets/illustration.png (the Vice City illustration) and writes
meme.png next to this script, 1200x675, white DejaVu Sans Bold captions
with a thick black stroke, centered, auto-fit to at most 2 lines per block.

Usage: python3 render.py
"""
import hashlib

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 675
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
HERE = Path(__file__).resolve().parent

TOP = "LUCIA & JASON AFTER ROBBING A BANK IN GTA 6"
BOTTOM = "THE CASH ONLY COVERS 2 WEEKS RENT IN VICE CITY"


def cover(img: Image.Image) -> Image.Image:
    """Center-crop + resize so the image covers exactly 1200x675."""
    iw, ih = img.size
    scale = max(W / iw, H / ih)
    nw, nh = int(iw * scale + 0.5), int(ih * scale + 0.5)
    img = img.resize((nw, nh), Image.LANCZOS)
    x = (nw - W) // 2
    y = (nh - H) // 2
    return img.crop((x, y, x + W, y + H))


def wrap_text(d: ImageDraw.ImageDraw, text: str, fnt, max_width: int):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=fnt) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_block(d: ImageDraw.ImageDraw, text: str, anchor_top: int | None,
               anchor_bottom: int | None) -> None:
    """Draw one caption block, auto-fit to at most 2 lines."""
    size = 64
    fnt = ImageFont.truetype(FONT, size)
    lines = wrap_text(d, text, fnt, W - 70)
    while len(lines) > 2 and size > 28:
        size -= 4
        fnt = ImageFont.truetype(FONT, size)
        lines = wrap_text(d, text, fnt, W - 70)
    lh = int(size * 1.12)
    total = lh * len(lines)
    if anchor_top is not None:
        y = anchor_top
    else:
        y = H - anchor_bottom - total
    sw = max(3, size // 9)
    for ln in lines:
        w = d.textlength(ln, font=fnt)
        d.text(((W - w) / 2, y), ln, font=fnt, fill="white",
               stroke_width=sw, stroke_fill="black")
        y += lh


def main() -> None:
    img = Image.open(HERE / "assets" / "illustration.png").convert("RGB")
    img = cover(img)
    d = ImageDraw.Draw(img)
    draw_block(d, TOP, anchor_top=16, anchor_bottom=None)
    draw_block(d, BOTTOM, anchor_top=None, anchor_bottom=18)
    out = HERE / "meme.png"
    img.save(out, optimize=True)
    digest = hashlib.sha256(out.read_bytes()).hexdigest()
    print(f"wrote {out} ({img.size[0]}x{img.size[1]}, sha256 {digest})")


if __name__ == "__main__":
    main()
