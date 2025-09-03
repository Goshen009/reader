from docx import Document
import json

def docx_to_html_paragraphs(docx_path, output_json_path):
    doc = Document(docx_path)
    paragraphs_list = []
    list_stack = []  # Track nested lists (<ul> or <ol>)

    for i, para in enumerate(doc.paragraphs, start=1):
        html_content = ""
        for run in para.runs:
            text = run.text.replace("\n", "")  # clean newlines
            if not text.strip():
                continue

            # Apply inline styles
            if run.bold:
                text = f"<strong>{text}</strong>"
            if run.italic:
                text = f"<em>{text}</em>"
            if run.underline:
                text = f"<u>{text}</u>"
            if run.font.strike:
                text = f"<s>{text}</s>"

            html_content += text

        if not html_content.strip():
            continue

        # Handle lists
        style = para.style.name
        if style.startswith("List Bullet"):
            html_content = f"<li>{html_content}</li>"
            if not list_stack or list_stack[-1] != "ul":
                html_content = "<ul>" + html_content
                list_stack.append("ul")
        elif style.startswith("List Number"):
            html_content = f"<li>{html_content}</li>"
            if not list_stack or list_stack[-1] != "ol":
                html_content = "<ol>" + html_content
                list_stack.append("ol")
        else:
            # Close any open lists
            while list_stack:
                html_content = f"</{list_stack.pop()}>" + html_content

        paragraphs_list.append({
            "number": i,
            "content": html_content
        })

    # Close any remaining lists at the end
    while list_stack:
        paragraphs_list.append({
            "number": len(paragraphs_list)+1,
            "content": f"</{list_stack.pop()}>"
        })

    # Write to JSON
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(paragraphs_list, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(paragraphs_list)} paragraphs to {output_json_path}")


# Example usage
docx_to_html_paragraphs("Letter019.docx", "book_paragraphs.json")
