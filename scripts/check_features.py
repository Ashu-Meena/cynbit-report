import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

BASE_WWW = 'https://www.cynbit.in'
BASE_APEX = 'https://cynbit.in'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

print("=== 1. Domain Canonicalization Check ===")
for u in [BASE_APEX, BASE_WWW, 'http://cynbit.in', 'http://www.cynbit.in']:
    r = requests.get(u, headers=headers, allow_redirects=False)
    print(f"{u:<25} -> Status: {r.status_code} | Location: {r.headers.get('location')}")

print("\n=== 2. Check /navigation route ===")
r_nav = requests.get(BASE_WWW + '/navigation', headers=headers)
print(f"/navigation status: {r_nav.status_code}, len: {len(r_nav.text)}")
soup_nav = BeautifulSoup(r_nav.text, 'html.parser')
print(f"Title: {soup_nav.title.string if soup_nav.title else 'None'}")
print("H1/H2:", [h.get_text(strip=True) for h in soup_nav.find_all(['h1', 'h2'])])

print("\n=== 3. Inspect Careers Application Flow ===")
r_career = requests.get(BASE_WWW + '/careers/qa-testing-intern', headers=headers)
print(f"/careers/qa-testing-intern status: {r_career.status_code}")
soup_car = BeautifulSoup(r_career.text, 'html.parser')
print("Title:", soup_car.title.string if soup_car.title else 'None')
buttons_car = [b.get_text(strip=True) for b in soup_car.find_all(['button', 'a']) if 'apply' in b.get_text(strip=True).lower()]
print("Apply buttons/links:", buttons_car)
for a in soup_car.find_all('a', href=True):
    if 'apply' in a.get_text(strip=True).lower() or 'apply' in a['href'].lower():
        print(f"  Apply link href: {a['href']} | text: {a.get_text(strip=True)}")

print("\n=== 4. Check BitElevate Paths & Diaries ===")
r_paths = requests.get(BASE_WWW + '/bitelevate/paths', headers=headers)
soup_paths = BeautifulSoup(r_paths.text, 'html.parser')
print(f"/bitelevate/paths H1:", [h.get_text(strip=True) for h in soup_paths.find_all('h1')])
path_links = [a['href'] for a in soup_paths.find_all('a', href=True) if '/bitelevate/' in a['href']]
print("Path links found:", set(path_links))

r_diaries = requests.get(BASE_WWW + '/diaries', headers=headers)
soup_diaries = BeautifulSoup(r_diaries.text, 'html.parser')
print(f"/diaries H1:", [h.get_text(strip=True) for h in soup_diaries.find_all('h1')])
diary_links = [a['href'] for a in soup_diaries.find_all('a', href=True) if '/diaries/' in a['href']]
print(f"Diaries links count: {len(diary_links)} (sample: {diary_links[:3]})")

print("\n=== 5. Check Case Studies ===")
r_cs = requests.get(BASE_WWW + '/case-studies', headers=headers)
soup_cs = BeautifulSoup(r_cs.text, 'html.parser')
cs_links = [a['href'] for a in soup_cs.find_all('a', href=True) if '/case-studies/' in a['href']]
print(f"Case studies links count: {len(cs_links)} (sample: {cs_links[:3]})")

print("\n=== 6. External Links Security (rel='noopener noreferrer') ===")
r_home = requests.get(BASE_WWW, headers=headers)
soup_home = BeautifulSoup(r_home.text, 'html.parser')
ext_links = []
for a in soup_home.find_all('a', href=True):
    href = a['href']
    if href.startswith('http') and 'cynbit.in' not in href:
        ext_links.append((href, a.get('target'), a.get('rel'), a.get('aria-label')))

print(f"Found {len(ext_links)} external links on homepage:")
for href, target, rel, aria in ext_links:
    print(f"  - {href} | target={target} | rel={rel} | aria-label={aria}")
