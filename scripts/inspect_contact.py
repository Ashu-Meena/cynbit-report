import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.cynbit.in/contact')
soup = BeautifulSoup(r.text, 'html.parser')
forms = soup.find_all('form')
print(f"Forms on /contact: {len(forms)}")
for i, f in enumerate(forms):
    print(f"--- Form {i} ---")
    print("Action:", f.get('action'), "Method:", f.get('method'))
    labels = f.find_all('label')
    print(f"Labels ({len(labels)}):")
    for l in labels:
        print(f"  for='{l.get('for')}': '{l.get_text(strip=True)}'")
    for el in f.find_all(['input', 'textarea', 'select', 'button']):
        print(f"  Tag: {el.name}, type: {el.get('type')}, name: {el.get('name')}, id: {el.get('id')}, req: {el.get('required')}")
