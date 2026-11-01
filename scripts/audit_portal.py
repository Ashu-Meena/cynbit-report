import requests
from bs4 import BeautifulSoup

url = 'https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm'
res = requests.get(url, timeout=10)
soup = BeautifulSoup(res.text, 'html.parser')

print("Title:", soup.title.string if soup.title else "None")
for h in soup.find_all(['h1', 'h2', 'h3', 'h4']):
    print(f"{h.name.upper()}: {h.get_text(strip=True)}")

forms = soup.find_all('form')
print(f"\nForms count: {len(forms)}")
for i, f in enumerate(forms):
    print(f"Form {i}: action={f.get('action')}, method={f.get('method')}")
    for inp in f.find_all(['input', 'textarea', 'button', 'select']):
        print(f"  Field: tag={inp.name}, type={inp.get('type')}, name={inp.get('name')}, placeholder={inp.get('placeholder')}, required={inp.get('required')}")

buttons = soup.find_all('button')
print(f"\nButtons ({len(buttons)}):")
for b in buttons:
    print(f"  Button: '{b.get_text(strip=True)}', type={b.get('type')}, class={b.get('class')}")
