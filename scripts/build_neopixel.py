"""Build a web copy of NEOPIXEL with the accented vowels it lacks.

NEOPIXEL has no accents at all, so "beltrà", "Experiència" and "Contáctame"
would fall back to another font. It's a pixel font, so a grave or acute is
just two of its own pixels stepping diagonally above the letter. Output: a
TrueType woff2 with printable ASCII, a little punctuation and à á è é ò ó
ù ú (and capitals). Usage: python build_neopixel.py in.otf out.woff2
"""
import sys

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

src = TTFont(sys.argv[1])
gs = src.getGlyphSet()
cmap = src.getBestCmap()
upm = src["head"].unitsPerEm


def bounds(name):
    p = BoundsPen(gs)
    gs[name].draw(p)
    return p.bounds  # xMin, yMin, xMax, yMax


# one "pixel" of the design: the full stop is a single pixel
px0, py0, px1, py1 = bounds(cmap[ord(".")])
PX = round(px1 - px0)

KEEP = [chr(c) for c in range(0x20, 0x7F)] + list("·–—’‘“”…")
ACCENTS = {"à": "a`", "á": "a´", "è": "e`", "é": "e´", "ò": "o`", "ó": "o´",
           "ù": "u`", "ú": "u´"}
ACCENTS.update({k.upper(): v[0].upper() + v[1] for k, v in ACCENTS.items()})


def rect(pen, x, y):
    # counter-clockwise, like the CFF outlines (the pen reverses them all)
    pen.moveTo((x, y))
    pen.lineTo((x + PX, y))
    pen.lineTo((x + PX, y + PX))
    pen.lineTo((x, y + PX))
    pen.closePath()


glyphs, metrics, cmap_out = {".notdef": TTGlyphPen(None).glyph()}, {".notdef": (upm // 2, 0)}, {}
for ch in KEEP + list(ACCENTS):
    base_ch, mark = ACCENTS.get(ch, ch + " ")[0], ACCENTS.get(ch, "  ")[1]
    if ord(base_ch) not in cmap:
        continue
    base = cmap[ord(base_ch)]
    tt = TTGlyphPen(None)
    pen = Cu2QuPen(tt, max_err=1, reverse_direction=True)
    gs[base].draw(pen)
    if mark.strip():
        x0, _, x1, top = bounds(base)
        cx = round(((x0 + x1) / 2 - PX) / PX) * PX  # snap to the pixel grid
        y = top + PX  # one pixel of air above the letter
        lo, hi = (cx, cx + PX) if mark == "`" else (cx + PX, cx)
        rect(pen, lo, y + PX)  # grave: top-left to bottom-right
        rect(pen, hi, y)
    name = f"uni{ord(ch):04X}"
    glyphs[name] = tt.glyph()
    adv = src["hmtx"][base][0]
    metrics[name] = (adv, glyphs[name].xMin if hasattr(glyphs[name], "xMin") else 0)
    cmap_out[ord(ch)] = name

order = list(glyphs)
fb = FontBuilder(upm, isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap(cmap_out)
fb.setupGlyf(glyphs)
for n, g in glyphs.items():
    g.recalcBounds(fb.font["glyf"])
    metrics[n] = (metrics[n][0], getattr(g, "xMin", 0))
fb.setupHorizontalMetrics(metrics)
hhea = src["hhea"]
fb.setupHorizontalHeader(ascent=hhea.ascent, descent=hhea.descent)
fb.setupNameTable({"familyName": "Neopixel", "styleName": "Regular"})
os2 = src["OS/2"]
fb.setupOS2(sTypoAscender=os2.sTypoAscender, sTypoDescender=os2.sTypoDescender,
            usWinAscent=os2.usWinAscent, usWinDescent=os2.usWinDescent)
fb.setupPost()
fb.font.flavor = "woff2"
fb.save(sys.argv[2])
print(f"pixel={PX} glyphs={len(order)} accents={sorted(c for c in ACCENTS if ord(c) in cmap_out)}")
