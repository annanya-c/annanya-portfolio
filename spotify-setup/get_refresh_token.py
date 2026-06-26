import requests
import urllib.parse
import base64

CLIENT_ID = "f8902b1fae384c31b88c30d58fd50008"
CLIENT_SECRET = "5a372b038ed0423ab3bb227a6e4d085a"
REDIRECT_URI = "http://127.0.0.1:8888/callback"

SCOPES = "user-read-currently-playing user-read-recently-played user-read-playback-state"

auth_url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode({
    "client_id": CLIENT_ID,
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPES,
})

print("\nOpen this URL in your browser:\n")
print(auth_url)
print("\nAfter approving, copy the FULL URL from the address bar and paste below.\n")

redirected_url = input("Paste the full redirect URL here: ").strip()

parsed = urllib.parse.urlparse(redirected_url)
code = urllib.parse.parse_qs(parsed.query)["code"][0]

auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

response = requests.post(
    "https://accounts.spotify.com/api/token",
    headers={
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
    },
    data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    },
)

data = response.json()

if "refresh_token" in data:
    print("\nYour refresh token:\n")
    print(data["refresh_token"])
else:
    print("\nSomething went wrong:")
    print(data)