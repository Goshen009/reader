import docx
import json

def split_by_whitespace(doc_path, output_path, max_chars=1000):
    doc = docx.Document(doc_path)
    text = " ".join([para.text for para in doc.paragraphs])

    pages = []
    start = 0
    page_num = 1
    while start < len(text):
        end = min(start + max_chars, len(text))
        if end < len(text):
            # find last whitespace before the cut
            while end > start and not text[end].isspace():
                end -= 1
        chunk = text[start:end].strip()
        if chunk:
            pages.append({"page": page_num, "content": chunk})
            page_num += 1
        start = end + 1

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

# Example usage
split_by_whitespace("Letter019.docx", "output_whitespace.json", max_chars=1000)
