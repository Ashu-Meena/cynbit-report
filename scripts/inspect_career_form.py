import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.cynbit.in/careers/qa-testing-intern')
soup = BeautifulSoup(r.text, 'html.parser')
app_el = soup.find(id='application-form')

print("Application Form Section:")
if app_el:
    forms = app_el.find_all('form')
    print(f"Found {len(forms)} form elements inside #application-form")
    for f in forms:
        print("Form action:", f.get('action'), "method:", f.get('method'))
        for el in f.find_all(['input', 'textarea', 'select', 'button']):
            print(f"  Tag: {el.name}, type: {el.get('type')}, name: {el.get('name')}, req: {el.get('required')}, id: {el.get('id')}, placeholder: {el.get('placeholder')}")
    if not forms:
        print("Snippet:", str(app_el)[:1000])
