import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.cynbit.in/careers/qa-testing-intern')
soup = BeautifulSoup(r.text, 'html.parser')
form = soup.find('form')

labels = form.find_all('label')
print(f"Total labels in career form: {len(labels)}")
unassociated = 0
for l in labels:
    for_attr = l.get('for')
    text = l.get_text(strip=True)
    if for_attr:
        target = form.find(id=for_attr)
        if not target:
            print(f"Broken label for='{for_attr}' (target element not found!): '{text}'")
            unassociated += 1
    else:
        # Check if input is nested inside label
        has_child_input = bool(l.find(['input', 'select', 'textarea']))
        if not has_child_input:
            print(f"Unassociated label (no 'for' attribute, no nested input): '{text}'")
            unassociated += 1

print(f"\nTotal unassociated/broken labels in career form: {unassociated} out of {len(labels)}")
