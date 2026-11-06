"""Redact the private phone from the owner's supplied PDF, then verify output."""

from pathlib import Path
import re
import sys

import fitz


source = Path(sys.argv[1])
target = Path("public/resume/Trunal_Patil_Resume_Public.pdf")
document = fitz.open(source)
if len(document) != 1:
    raise SystemExit("Unexpected résumé page count; review manually before publishing")
page = document[0]
private_numbers = re.findall(r"\+91[0-9]{10}", page.get_text())
if len(private_numbers) != 1:
    raise SystemExit("Expected exactly one private contact number")
private_number = private_numbers[0]
matches = page.search_for(private_number)
if len(matches) != 1:
    raise SystemExit("Expected private phone was not found exactly once")

# The phone and its trailing separator occupy this single contact-line segment.
phone = matches[0]
redaction = fitz.Rect(phone.x0 - 0.5, phone.y0 - 0.5, phone.x1 + 4, phone.y1 + 0.5)
page.add_redact_annot(redaction, fill=(1, 1, 1))
page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
page.insert_text((phone.x0 + 1, phone.y1 - 1.5), "Email:", fontsize=7, color=(0.1, 0.1, 0.1))
# Canva also copied the contact line into the PDF's tagged structure /E text.
# Redacting the visible glyphs alone would leave that private value recoverable.
for xref in range(1, document.xref_length()):
    obj = document.xref_object(xref)
    if private_number in obj:
        document.update_object(xref, obj.replace(private_number + "|", "Email:"))
document.set_metadata({"title": "Trunal Patil - Public Resume", "author": "Trunal Patil"})
target.parent.mkdir(parents=True, exist_ok=True)
document.save(target, garbage=4, deflate=True, clean=True)
document.close()

with fitz.open(target) as checked:
    text = "\n".join(page.get_text() for page in checked)
    if len(checked) != 1 or "TRUNAL PATIL" not in text or "Email:" not in text:
        raise SystemExit("Public résumé failed content/page checks")
    if private_number in text:
        raise SystemExit("Private phone remains in extracted text")
    links = [link.get("uri", "") for page in checked for link in page.get_links()]
    if not any(link.startswith("mailto:") for link in links):
        raise SystemExit("Email link was lost")
    checked[0].get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(
        ".local/public-resume-review.png"
    )
if private_number.encode() in target.read_bytes():
    raise SystemExit("Private phone remains in PDF bytes")
print(f"Public résumé verified: {len(text)} text characters, {len(links)} links, {target.stat().st_size} bytes")
