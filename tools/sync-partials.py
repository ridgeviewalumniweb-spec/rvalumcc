"""Copy the shared header / footer / call-to-action into every page.

The pages stay plain static HTML (nothing to build, works with JavaScript off).
Edit partials/*.html, then run from the site folder:

    python tools/sync-partials.py

Each page marks where a partial goes with a pair of comments, e.g.
    <!-- partial:header --> ... <!-- /partial:header -->
Everything between the markers is replaced. The nav link for the current page
gets aria-current="page".
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = {p.stem: p.read_text(encoding="utf-8").strip() for p in (ROOT / "partials").glob("*.html")}


def url_for(page: pathlib.Path) -> str:
    rel = page.relative_to(ROOT).as_posix()
    return "/" + rel.removesuffix("index.html")


def render(name: str, page_url: str) -> str:
    html = PARTIALS[name]
    if name == "header":
        html = html.replace(f'<a href="{page_url}">', f'<a href="{page_url}" aria-current="page">')
    return html


changed = 0
for page in sorted(ROOT.rglob("*.html")):
    if "partials" in page.parts:
        continue
    text = page.read_text(encoding="utf-8")
    new = text
    for name in PARTIALS:
        pattern = re.compile(rf"(<!-- partial:{name} -->)(.*?)(<!-- /partial:{name} -->)", re.S)
        new = pattern.sub(lambda m: f"{m.group(1)}\n{render(name, url_for(page))}\n{m.group(3)}", new)
    if new != text:
        page.write_text(new, encoding="utf-8", newline="\n")
        changed += 1
        print("updated", page.relative_to(ROOT).as_posix())
print(f"{changed} page(s) updated")
