import requests

TTS_API_URL = "http://127.0.0.1:9882"

print(f"📡 Connecting to {TTS_API_URL} with 5s timeout...")
try:
    # Just checking root or a harmless endpoint to see if it responds
    response = requests.get(TTS_API_URL, timeout=5)
    print(f"✅ Server is Alive! Status: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("❌ Connection Refused. Port 9882 is closed.")
except requests.exceptions.Timeout:
    print("❌ Connection Timed Out (5s). Server is hanging.")
except Exception as e:
    print(f"❌ Error: {e}")
