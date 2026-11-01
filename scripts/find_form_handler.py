with open('candidate_page_bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find form submission functions
matches = re.finditer(r'Primary Deliverable Link', text)
for m in matches:
    start = max(0, m.start() - 600)
    end = min(len(text), m.end() + 800)
    print("=== Snippet near Primary Deliverable Link ===")
    print(text[start:end])
    print("\n" + "="*50 + "\n")
