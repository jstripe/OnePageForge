# Usage: python3 scripts/brand-assets.py "BrandName"
# Regenerates favicon set, maskable icons and the OG image into public/. Needs Pillow.
import sys, math, json
from PIL import Image, ImageDraw, ImageFont

NAME = sys.argv[1] if len(sys.argv) > 1 else "SiteForge"
TAGLINE = ("Describe your business.", "Get a website.")
S = 1024

def mark(size, maskable=False):
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    g = Image.new("RGBA", (S, S)); gp = g.load()
    for y in range(S):
        for x in range(S):
            t = (x + y) / (2 * S); gp[x, y] = (int(96 + (37 - 96) * t), int(165 + (99 - 165) * t), int(250 + (235 - 250) * t), 255)
    m = Image.new("L", (S, S), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, S, S), radius=0 if maskable else 230, fill=255)
    im.paste(g, (0, 0), m)
    sc = 0.62 if maskable else 1.0; o = S * (1 - sc) / 2
    P = lambda v: o + v * S * sc
    d.rounded_rectangle((P(.24), P(.26), P(.72), P(.78)), radius=S * sc * .06, fill=(255, 255, 255, 255))
    for i, w in enumerate((.36, .30, .22)):
        y = .38 + i * .12
        d.rounded_rectangle((P(.31), P(y), P(.31 + w), P(y + .045)), radius=S * sc * .022, fill=(37, 99, 235, 255))
    cx, cy, r = P(.72), P(.26), S * sc * .17
    pts = [(cx + (r if k % 2 == 0 else r * .38) * math.cos(k * math.pi / 4 - math.pi / 2), cy + (r if k % 2 == 0 else r * .38) * math.sin(k * math.pi / 4 - math.pi / 2)) for k in range(8)]
    d.polygon(pts, fill=(254, 240, 138, 255), outline=(37, 99, 235, 255))
    return im.resize((size, size), Image.LANCZOS)

o = "public/icons/"
for n, s in [("icon-16", 16), ("icon-32", 32), ("icon-48", 48), ("apple-touch-icon", 180), ("icon-192", 192), ("icon-512", 512)]:
    mark(s).save(o + n + ".png")
mark(512, True).save(o + "icon-maskable-512.png"); mark(192, True).save(o + "icon-maskable-192.png")
mark(256).save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

W, H = 1200, 630
og = Image.new("RGB", (W, H), (10, 15, 30)); px = og.load()
for y in range(H):
    for x in range(W):
        t = max(0, 1 - math.hypot(x - 600, y) / 700); px[x, y] = (int(10 + 30 * t), int(15 + 80 * t), int(30 + 190 * t))
m = mark(200); og.paste(m, (90, 140), m)
d = ImageDraw.Draw(og); f = lambda s: ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", s, index=1)
d.text((320, 150), NAME, font=f(84), fill="white")
d.text((90, 380), TAGLINE[0], font=f(68), fill="white"); d.text((90, 462), TAGLINE[1], font=f(68), fill=(96, 165, 250))
og.save("public/og-image.png", optimize=True)
print("brand assets regenerated for", NAME)
