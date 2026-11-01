import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json

BASE = 'https://www.cynbit.in'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 QA-Audit/1.0'}

print('=== 1. ROBOTS & SITEMAP PROBE ===')
for path in ['/robots.txt', '/sitemap.xml', '/sitemap-0.xml', '/api/sitemap', '/favicon.ico', '/favicon.svg']:
    try:
        res = requests.get(BASE + path, headers=headers, timeout=10)
        print(f"{path}: status {res.status_code}, type {res.headers.get('content-type', 'unknown')}, size {len(res.content)} bytes")
        if res.status_code == 200 and 'text' in res.headers.get('content-type', ''):
            print(f"Content excerpt:\n{res.text[:200]}\n---")
    except Exception as e:
        print(f"{path}: Error {e}")

print('\n=== 2. SECURITY HEADERS PROBE ===')
try:
    res = requests.get(BASE, headers=headers, timeout=10)
    sec_headers = [
        'Strict-Transport-Security',
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
        'X-XSS-Protection'
    ]
    for sh in sec_headers:
        print(f"{sh}: {res.headers.get(sh, 'MISSING')}")
    print(f"Server header: {res.headers.get('server', 'Not exposed')}")
    print(f"X-Powered-By: {res.headers.get('x-powered-by', 'Not exposed')}")
    print(f"Status Code: {res.status_code}")
except Exception as e:
    print(f"Root request error: {e}")

print('\n=== 3. CRAWL INTERNAL LINKS FROM HOMEPAGE ===')
try:
    res = requests.get(BASE, headers=headers, timeout=10)
    soup = BeautifulSoup(res.text, 'html.parser')
    links = set()
    for a in soup.find_all('a', href=True):
        href = a['href']
        full_url = urljoin(BASE, href)
        parsed = urlparse(full_url)
        if parsed.netloc == 'www.cynbit.in' or parsed.netloc == 'cynbit.in':
            links.add(parsed.path if parsed.path else '/')
        else:
            print(f"External link found: {full_url} (Anchor text: {a.get_text(strip=True)})")

    print(f"\nDiscovered {len(links)} internal paths:")
    for path in sorted(links):
        print(f"  - {path}")
except Exception as e:
    print(f"Crawl error: {e}")
