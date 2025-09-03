import docx
import json

def split_by_words(doc_path, output_path, max_words=200):
    doc = docx.Document(doc_path)
    words = []
    for para in doc.paragraphs:
        words.extend(para.text.split())

    pages = []
    page_num = 1
    for i in range(0, len(words), max_words):
        chunk = " ".join(words[i:i+max_words])
        pages.append({"page": page_num, "content": chunk})
        page_num += 1

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

# Example usage
split_by_words("Letter019.docx", "output_words.json", max_words=250)
