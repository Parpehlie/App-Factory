#!/usr/bin/env python3
"""Prepare and optimize images, fonts, and Vestiges screenshots for apps/web/public."""

from pathlib import Path
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WEB_ROOT = Path(__file__).resolve().parent.parent
PUBLIC = WEB_ROOT / "public"
IMAGES = PUBLIC / "images"
PROJECTS = IMAGES / "projects"
VESTIGES = IMAGES / "vestiges"
FONTS = PUBLIC / "fonts"

for d in (IMAGES, PROJECTS, VESTIGES, FONTS):
    d.mkdir(parents=True, exist_ok=True)


def save_webp(im: Image.Image, dest: Path, max_width: int | None = None, quality: int = 86, nearest: bool = False) -> None:
    if max_width and im.width > max_width:
        ratio = max_width / im.width
        resample = Image.Resampling.NEAREST if nearest else Image.Resampling.LANCZOS
        im = im.resize((max_width, int(round(im.height * ratio))), resample)
    im.save(dest, "WEBP", quality=quality, method=6)
    print(f"Saved {dest.relative_to(PUBLIC)} ({im.size[0]}x{im.size[1]}, {dest.stat().st_size // 1024} KB)")


def patch_mirror_corner(im: Image.Image, box_w: int, box_h: int) -> Image.Image:
    """Replace bottom-right dev badge using horizontally mirrored bottom-left stone texture."""
    out = im.copy()
    w, h = out.size
    patch = out.crop((0, h - box_h, box_w, h)).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    out.paste(patch, (w - box_w, h - box_h))
    return out


# 1. Copy Vestiges pixel-art fonts
vestiges_fonts = Path("/home/raphael/dev/perso/vestiges/assets/fonts")
shutil.copy2(vestiges_fonts / "alkhemikal/Alkhemikal.ttf", FONTS / "Alkhemikal.ttf")
shutil.copy2(vestiges_fonts / "pixel-operator/PixelOperator.ttf", FONTS / "PixelOperator.ttf")
shutil.copy2(vestiges_fonts / "pixel-operator/PixelOperator-Bold.ttf", FONTS / "PixelOperator-Bold.ttf")
print("Copied Vestiges fonts.")

# 2. Portrait & Hub project visuals
portrait_src = Path("/home/raphael/dev/perso/Atlas/public/images/Raphael-Plassart.png")
with Image.open(portrait_src) as im:
    save_webp(im.convert("RGB"), IMAGES / "raphael-plassart.webp", max_width=640, quality=86)

atlas_work = Path("/home/raphael/dev/perso/Atlas/public/images/work")
with Image.open(atlas_work / "permapaysage.webp") as im:
    save_webp(im.convert("RGB"), PROJECTS / "atlas-permapaysage.webp", max_width=1280, quality=85)
with Image.open(atlas_work / "lejardinierduvignoble.webp") as im:
    save_webp(im.convert("RGB"), PROJECTS / "atlas-jardinier.webp", max_width=960, quality=84)

qoredb_dir = Path("/home/raphael/dev/perso/raph-portfolio/public/images/projects/qoredb")
with Image.open(qoredb_dir / "query.webp") as im:
    save_webp(im.convert("RGB"), PROJECTS / "qoredb-query.webp", max_width=1100, quality=86)
with Image.open(qoredb_dir / "er-diagram.webp") as im:
    save_webp(im.convert("RGB"), PROJECTS / "qoredb-er.webp", max_width=1100, quality=86)

with Image.open(WEB_ROOT / "scripts" / "portfolio-hero-source.png") as im:
    hero = im.convert("RGB").crop((0, 0, 1008, 636))
    save_webp(hero, PROJECTS / "portfolio-home.webp", quality=90)

with Image.open("/home/raphael/dev/perso/raph-portfolio/public/images/projects/Melios.png") as im:
    src = im.convert("RGB")
    melios_card = Image.new("RGB", (1280, 752), (255, 255, 255))
    brand = src.crop((45, 200, 439, 855)).copy()
    brand_draw = ImageDraw.Draw(brand)
    brand_draw.rectangle((345, 315, 394, 520), fill=(255, 255, 255))
    melios_card.paste(brand, (60, 48))
    phones = src.crop((438, 0, 1100, 1100)).resize((550, 914), Image.Resampling.LANCZOS)
    melios_card.paste(phones, (730, -55))
    save_webp(melios_card, PROJECTS / "melios.webp", quality=88)

with Image.open("/home/raphael/dev/perso/Leximon/apps/mobile/store/presentation-1024x500.png") as im:
    save_webp(im.convert("RGB"), PROJECTS / "leximon.webp", max_width=1024, quality=88)

with Image.open("/home/raphael/dev/perso/raph-portfolio/public/images/projects/Raphotos.png") as im:
    # Crop just the rich visual preview or keep crisp webp
    save_webp(im.convert("RGB"), PROJECTS / "raphotos.webp", max_width=960, quality=86)

shutil.copy2("/home/raphael/dev/perso/vestiges/assets/icon_vestiges_256.png", VESTIGES / "icon-256.png")

# 3. Vestiges clean 16:9 screenshots
planches = Path("/home/raphael/dev/perso/vestiges/doc/plans/planches")
menus_audit = Path("/home/raphael/dev/perso/vestiges/doc/audits/menus-2026-10-11")

# Campement (clean 1920x1080)
with Image.open(planches / "36-M11-campement-1080.png") as im:
    camp = im.convert("RGB")
    save_webp(camp, VESTIGES / "screen-campement.webp", max_width=1280, quality=90, nearest=True)

# Plan 58 T2b composite (2608x1612) -> 3 clean 1280x720 panels
with Image.open(planches / "plan58_t2b_cale_quais.png") as im:
    t2b = im.convert("RGB")
    save_webp(t2b.crop((16, 60, 1296, 780)), VESTIGES / "screen-bas-port-cale.webp", quality=90, nearest=True)
    save_webp(t2b.crop((1312, 60, 2592, 780)), VESTIGES / "screen-bas-port-quais.webp", quality=90, nearest=True)
    save_webp(t2b.crop((1312, 836, 2592, 1556)), VESTIGES / "screen-bois-belvedere.webp", quality=90, nearest=True)

# Plan 58 T3b1 Saint-Aubin top-left panel (crop cleanly above dev bar at y=512 so NIV.1 and minimap stay intact)
with Image.open(planches / "plan58_t3b1_saint_aubin.png") as im:
    t3 = im.convert("RGB").crop((0, 0, 960, 512))
    save_webp(t3, VESTIGES / "screen-haute-ville.webp", quality=92, nearest=True)

# Plan 30 T2 Souverain (1600x900 -> two 800x450 bottom quadrants; patch only the tiny bottom-right MODE DEV label)
with Image.open(planches / "30-t2-souverain.png") as im:
    souv = im.convert("RGB")
    for fname, qbox in [
        ("screen-horde-serie.webp", (0, 450, 800, 900)),
        ("screen-horde-combat.webp", (800, 450, 1600, 900)),
    ]:
        q = souv.crop(qbox)
        # Copy adjacent clean terrain strip (x: 560..680, y: 432..446) over MODE DEV box (x: 680..800, y: 432..446)
        clean_strip = q.crop((560, 432, 680, 446))
        q.paste(clean_strip, (680, 432))
        save_webp(q, VESTIGES / fname, quality=92, nearest=True)

# Personnages (1280x720) -> mirror bottom-left dark border over bottom-right dev badge
with Image.open(planches / "36-M10-personnages-720.png") as im:
    pers = patch_mirror_corner(im.convert("RGB"), 270, 54)
    save_webp(pers, VESTIGES / "screen-personnages.webp", quality=90, nearest=True)

# Niveau / Fragment de memoire (1920x1080)
with Image.open(menus_audit / "niveau-1080.png") as im:
    niv = patch_mirror_corner(im.convert("RGB"), 340, 76)
    save_webp(niv, VESTIGES / "screen-levelup.webp", max_width=1280, quality=90, nearest=True)

# Faille (1920x1080)
with Image.open(planches / "36-M10-faille-1080.png") as im:
    faille = patch_mirror_corner(im.convert("RGB"), 360, 72)
    save_webp(faille, VESTIGES / "screen-faille.webp", max_width=1280, quality=90, nearest=True)


# 4. Generate 1200x630 Open Graph images
def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    if path.exists():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


# Try to locate clean sans font on system for og-parphelie
sans_candidates = [
    Path("/usr/share/fonts/TTF/ttf-google-fonts-typewolf/Poppins-Bold.ttf"),
    Path("/usr/share/fonts/OpenSans/OpenSans-Bold.ttf"),
]
sans_reg_candidates = [
    Path("/usr/share/fonts/TTF/ttf-google-fonts-typewolf/Poppins-Regular.ttf"),
    Path("/usr/share/fonts/OpenSans/OpenSans-Regular.ttf"),
]
font_bold_path = next((p for p in sans_candidates if p.exists()), None)
font_reg_path = next((p for p in sans_reg_candidates if p.exists()), None)

# 4a. OG Parphelie (1200x630)
og_p = Image.new("RGB", (1200, 630), (31, 59, 217))
draw_p = ImageDraw.Draw(og_p)
# Subtle contour rings on right
for r in (220, 300, 380, 460):
    draw_p.ellipse((940 - r, 315 - r, 940 + r, 315 + r), outline=(65, 92, 235), width=2)
# Yellow beacon bar
draw_p.rounded_rectangle((72, 74, 344, 118), radius=22, fill=(255, 216, 77))
f_tag = ImageFont.truetype(str(font_bold_path), 19) if font_bold_path else ImageFont.load_default()
f_h1 = ImageFont.truetype(str(font_bold_path), 46) if font_bold_path else ImageFont.load_default()
f_sub = ImageFont.truetype(str(font_reg_path), 24) if font_reg_path else ImageFont.load_default()
f_meta = ImageFont.truetype(str(font_bold_path), 22) if font_bold_path else ImageFont.load_default()
draw_p.text((95, 83), "PARPHÉLIE · ATLAS", fill=(13, 18, 34), font=f_tag)
draw_p.text((72, 152), "Raphaël Plassart", fill=(255, 255, 255), font=f_h1)
draw_p.text((72, 214), "Développeur web freelance", fill=(255, 216, 77), font=f_h1)
draw_p.text((72, 314), "Sites sur-mesure pour artisans & commerçants (Atlas)\nProduits web, logiciels open source & jeux vidéo.", fill=(235, 240, 255), font=f_sub, spacing=14)
draw_p.text((72, 505), "parphelie.com  ·  07 69 89 28 62  ·  raphael@parphelie.com", fill=(255, 216, 77), font=f_meta)
# Paste rounded portrait on right
with Image.open(portrait_src) as pim:
    pim_rgb = pim.convert("RGB").resize((310, 380), Image.Resampling.LANCZOS)
    mask = Image.new("L", (310, 380), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 310, 380), radius=28, fill=255)
    og_p.paste(pim_rgb, (818, 108), mask)
    draw_p.rounded_rectangle((818, 108, 1128, 488), radius=28, outline=(255, 216, 77), width=4)
og_p.save(PUBLIC / "og-parphelie.png", "PNG", optimize=True)
print("Saved og-parphelie.png")

# 4b. OG Vestiges (1200x630)
og_v = Image.new("RGB", (1200, 630), (26, 26, 46))
with Image.open(VESTIGES / "screen-bas-port-cale.webp") as bg_im:
    bg_crop = bg_im.convert("RGB").resize((1200, 675), Image.Resampling.NEAREST).crop((0, 22, 1200, 652))
    # Darken slightly for contrast
    arr_v = (np.array(bg_crop, dtype=np.float32) * 0.42).astype(np.uint8)
    og_v = Image.fromarray(arr_v)
draw_v = ImageDraw.Draw(og_v)
draw_v.rectangle((40, 40, 1160, 590), outline=(212, 168, 67), width=3)
f_alk = load_font(FONTS / "Alkhemikal.ttf", 118)
f_pix = load_font(FONTS / "PixelOperator-Bold.ttf", 34)
f_pix_sm = load_font(FONTS / "PixelOperator.ttf", 28)
with Image.open(VESTIGES / "icon-256.png") as icon:
    ic = icon.resize((128, 128), Image.Resampling.NEAREST)
    og_v.paste(ic, (92, 92), ic if ic.mode == "RGBA" else None)
draw_v.text((250, 88), "VESTIGES", fill=(212, 168, 67), font=f_alk)
draw_v.text((92, 260), "Un survivors-like où tu remontes la nuit\nqu'une ville a voulu oublier.", fill=(232, 224, 212), font=f_pix, spacing=12)
draw_v.text((92, 390), "La Série · Le Vide · 5 Terres de Vaulme · Godot 4 & C#", fill=(180, 170, 155), font=f_pix_sm)
draw_v.text((92, 515), "parphelie.com/vestiges", fill=(212, 168, 67), font=f_pix)
og_v.save(PUBLIC / "og-vestiges.png", "PNG", optimize=True)
print("Saved og-vestiges.png")
