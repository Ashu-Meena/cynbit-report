import requests
import re
from bs4 import BeautifulSoup

BASE = 'https://www.cynbit.in'
headers = {'User-Agent': 'Mozilla/5.0'}

# 1. Fetch Candidate page script chunks
cand_url = f'{BASE}/candidate/cmvsg2zsf000108jqm6dfrbjm'
res = requests.get(cand_url, headers=headers)
soup = BeautifulSoup(res.text, 'html.parser')
scripts = [s['src'] for s in soup.find_all('script', src=True)]

print(f"Found {len(scripts)} scripts on candidate portal page:")
for s in scripts:
    print(" ", s)

# Let's inspect the candidate chunk specifically
for s in scripts:
    if 'candidate' in s or 'cmvsg' in s or 'app' in s:
        script_url = urljoin(BASE, s)
        try:
            s_res = requests.get(script_url, headers=headers)
            # Find fetch or action calls
            fetches = re.findall(r'fetch\([\'"`]([^\'"`]+)[\'"`]', s_res.text)
            actions = re.findall(r'action:[\'"`]([^\'"`]+)[\'"`]', s_res.text)
            apis = re.findall(r'/(?:api|candidate)/[a-zA-Z0-9_\-\/]+', s_res.text)
            print(f"\n--- Script {s} ({len(s_res.content)} bytes) ---")
            if fetches:
                print("  Fetches:", set(fetches))
            if actions:
                print("  Actions:", set(actions))
            if apis:
                print("  API patterns:", set(apis))
        except Exception as e:
            print(f"Error fetching script {s}: {e}")
