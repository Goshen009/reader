import json
from docx import Document

def docx_to_json_with_page_breaks(docx_path, output_path):
    doc = Document(docx_path)
    pages = []
    page_number = 1
    html_parts = []

    for para in doc.paragraphs:
        for run in para.runs:
            text = run.text
            if run.bold:
                text = f"<b>{text}</b>"
            if run.italic:
                text = f"<i>{text}</i>"
            html_parts.append(text)
                
            # Check for page break in the run
            if run._element.xpath(".//w:br[@w:type='page']"):
                # End of current page
                pages.append({
                    "page": page_number,
                    "html": "".join(html_parts)
                })
                page_number += 1
                html_parts = []  # Reset for next page

        # Add paragraph break
        html_parts.append("<br>")

    # Catch any remaining text after last page break
    if html_parts:
        pages.append({
            "page": page_number,
            "html": "".join(html_parts)
        })

    # Save JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(pages, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    docx_to_json_with_page_breaks("Letter019.docx", "outputFromDocx.json")
