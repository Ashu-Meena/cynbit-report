import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import time

BASE = 'https://www.cynbit.in'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

# 1. Test Key Static & Dynamic Routes
key_routes = [
    '/',
    '/story',
    '/team',
    '/contact',
    '/careers',
    '/careers/qa-testing-intern',
    '/careers/full-stack-developer',
    '/services',
    '/products',
    '/case-studies',
    '/case-studies/urban-wardrobe-ar-integration',
    '/impact',
    '/bitelevate',
    '/bitelevate/paths',
    '/diaries',
    '/blog',
    '/blog/ai-agents-business-operations',
    '/privacy',
    '/terms',
    '/cookies',
    '/candidate/cmvsg2zsf000108jqm6dfrbjm',
    '/navigation',
    '/non-existent-page-404'
]

print(f"=== Auditing {len(key_routes)} Key Routes ===", flush=True)

route_data = []
all_broken_links = []
all_broken_images = []
accessibility_issues = []

for path in key_routes:
    url = BASE + path
    start = time.time()
    try:
        r = requests.get(url, headers=headers, timeout=12)
        elapsed = round((time.time() - start) * 1000, 1)
        soup = BeautifulSoup(r.text, 'html.parser')
        
        title = soup.title.string.strip() if soup.title and soup.title.string else 'MISSING TITLE'
        h1s = [h.get_text(strip=True) for h in soup.find_all('h1')]
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        desc = meta_desc['content'].strip() if meta_desc and 'content' in meta_desc.attrs else None
        
        # Images without alt
        imgs = soup.find_all('img')
        missing_alt = [img.get('src') for img in imgs if not img.get('alt')]
        
        # Check buttons without accessible name
        empty_buttons = [b for b in soup.find_all('button') if not b.get_text(strip=True) and not b.get('aria-label')]
        
        # Check links without text or aria-label
        empty_links = [a.get('href') for a in soup.find_all('a') if not a.get_text(strip=True) and not a.find('img') and not a.get('aria-label')]
        
        route_info = {
            'path': path,
            'url': url,
            'status_code': r.status_code,
            'response_time_ms': elapsed,
            'title': title,
            'h1_count': len(h1s),
            'h1_texts': h1s,
            'has_meta_description': bool(desc),
            'meta_description_len': len(desc) if desc else 0,
            'total_images': len(imgs),
            'missing_alt_count': len(missing_alt),
            'missing_alt_samples': missing_alt[:5],
            'empty_buttons_count': len(empty_buttons),
            'empty_links_count': len(empty_links),
            'empty_links_samples': empty_links[:5],
        }
        route_data.append(route_info)
        print(f"[{r.status_code}] {path:<35} | {elapsed:>6}ms | H1s: {len(h1s)} | Imgs: {len(imgs)} (NoAlt: {len(missing_alt)})", flush=True)

    except Exception as e:
        print(f"[ERROR] {path}: {e}", flush=True)

# 2. Test API / Form endpoints and Newsletter Submission
print("\n=== Testing API & Form Endpoints ===", flush=True)

# Check common API paths
api_endpoints = [
    '/api/newsletter',
    '/api/subscribe',
    '/api/contact',
    '/api/lead',
    '/api/candidate/submit',
    '/api/candidate/cmvsg2zsf000108jqm6dfrbjm',
    '/api/health',
    '/api/version'
]

api_results = []
for ep in api_endpoints:
    ep_url = BASE + ep
    try:
        # GET probe
        get_res = requests.get(ep_url, headers=headers, timeout=8)
        # POST probe with empty data
        post_res = requests.post(ep_url, json={}, headers=headers, timeout=8)
        
        res_info = {
            'endpoint': ep,
            'get_status': get_res.status_code,
            'post_status': post_res.status_code,
            'post_resp': post_res.text[:150]
        }
        api_results.append(res_info)
        print(f"API {ep:<25} GET: {get_res.status_code} | POST: {post_res.status_code} | Body: {post_res.text[:60]}", flush=True)
    except Exception as e:
        print(f"API {ep}: {e}", flush=True)

# 3. Save combined data
full_report = {
    'routes': route_data,
    'api_endpoints': api_results,
    'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
}

with open('deep_audit_results.json', 'w', encoding='utf-8') as f:
    json.dump(full_report, f, indent=2)

print("\nDeep audit complete. Saved to deep_audit_results.json", flush=True)
