import fitz
from pathlib import Path

pdfs = {
    "bha3000": Path("assets/BHA 3000.pdf"),
    "bha5000": Path("assets/BHA 5000.pdf"),
    "bha5100": Path("assets/BHA 5100.pdf"),
}
out = Path("assets/products")
out.mkdir(parents=True, exist_ok=True)

for slug, pdf in pdfs.items():
    doc = fitz.open(pdf)
    print(f"=== {slug} pages={doc.page_count} ===")
    for pi in range(doc.page_count):
        page = doc[pi]
        imgs = page.get_images(full=True)
        print(f" page {pi}: {len(imgs)} images")
        for idx, img in enumerate(imgs):
            xref = img[0]
            base = doc.extract_image(xref)
            ext = base["ext"]
            name = out / f"{slug}-p{pi+1}-img{idx+1}.{ext}"
            name.write_bytes(base["image"])
            print(f"  saved {name.name} {base['width']}x{base['height']}")
    page0 = doc[0]
    pix = page0.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    hero = out / f"{slug}-page1-render.png"
    pix.save(hero)
    print(f" render {hero.name} {pix.width}x{pix.height}")
    doc.close()
