import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time
import json

BASE = 'https://www.cynbit.in'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 QA-Audit/1.0'}

print("=== Fetching & Parsing sitemap.xml ===")
res = requests.get(BASE + '/sitemap.xml', headers=headers)
sitemap_urls = []
try:
    root = ET.fromstring(res.content)
    # XML namespace handling
    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    for loc in root.findall('.//ns:loc', ns):
        sitemap_urls.append(loc.text.strip())
    if not sitemap_urls:
        for loc in root.iter():
            if loc.tag.endswith('loc'):
                sitemap_urls.append(loc.text.strip())
except Exception as e:
    print(f"Error parsing sitemap XML: {e}")

print(f"Found {len(sitemap_urls)} URLs in sitemap:")
for u in sitemap_urls:
    print(f"  {u}")

# Now let's audit each page
audit_results = []
broken_links = []
images_missing_alt = []
console_warnings = []

all_urls_to_test = list(set(sitemap_urls + [
    BASE + '/',
    BASE + '/story',
    BASE + '/team',
    BASE + '/careers',
    BASE + '/impact',
    BASE + '/services',
    BASE + '/products',
    BASE + '/case-studies',
    BASE + '/bitelevate',
    BASE + '/bitelevate/paths',
    BASE + '/diaries',
    BASE + '/blog',
    BASE + '/contact',
    BASE + '/privacy',
    BASE + '/terms',
    BASE + '/cookies',
    BASE + '/navigation',
    BASE + '/portal',
    BASE + '/admin',
    BASE + '/login',
    BASE + '/non-existent-page-404-test'
]))

print(f"\n=== Auditing {len(all_urls_to_test)} Pages ===")
for url in all_urls_to_test:
    start_t = time.time()
    try:
        r = requests.get(url, headers=headers, timeout=12, allow_redirects=True)
        dur = round((time.time() - start_t) * 1000, 2)
        status = r.status_code
        soup = BeautifulSoup(r.text, 'html.parser')
        
        title = soup.title.string.strip() if soup.title and soup.title.string else 'NO TITLE'
        h1s = [h.get_text(strip=True) for h in soup.find_all('h1')]
        
        # Check images
        page_imgs = soup.find_all('img')
        missing_alt = [img.get('src', 'no-src') for img in page_imgs if not img.get('alt')]
        
        # Check empty buttons / links
        empty_links = [a.get('href', '') for a in soup.find_all('a') if not a.get_text(strip=True) and not a.find('img') and not a.get('aria-label')]
        
        # Check meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        desc_val = meta_desc['content'] if meta_desc and 'content' in meta_desc.attrs else None

        # Check canonical
        canonical = soup.find('link', rel='canonical')
        canonical_val = canonical['href'] if canonical and 'href' in canonical.attrs else None

        info = {
            'url': url,
            'status': status,
            'response_time_ms': dur,
            'final_url': r.url,
            'title': title,
            'h1_count': len(h1s),
            'h1s': h1s,
            'meta_description': desc_val,
            'canonical': canonical_val,
            'total_images': len(page_imgs),
            'missing_alt_images': missing_alt,
            'empty_accessible_links': empty_links,
        }
        audit_results.append(info)
        print(f"[{status}] {url} - {dur}ms | H1s: {len(h1s)} | Title: {title[:40]} | EmptyLinks: {len(empty_links)}")

    except Exception as e:
        print(f"[ERR] {url} - {e}")
        audit_results.append({'url': url, 'status': 'EXCEPTION', 'error': str(e)})

with open('audit_results.json', 'w', encoding='utf-8') as f:
    json.dump(audit_results, f, indent=2)

print("\nSaved page audit to audit_results.json")
