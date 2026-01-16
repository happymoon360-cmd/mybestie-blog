import requests
import os

TTS_API_URL = "http://127.0.0.1:9882"

# Path that was causing issues - SIMPLIFIED
ref_audio = r"c:\Users\happy\.gemini\antigravity\scratch\content-osmu\ref.wav"
ref_text = "가끔 그 영화를 생각해요."

payload = {
    "text": "테스트 음성입니다.",
    "text_language": "ko",
    "refer_wav_path": ref_audio,
    "prompt_text": ref_text,
    "prompt_language": "ko"
}

print(f"📡 Sending POST request to {TTS_API_URL}...")
print(f"Payload: {payload}")

try:
    response = requests.post(TTS_API_URL, json=payload, timeout=30)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"✅ Success! Content length: {len(response.content)}")
    else:
        print(f"❌ Failed. Response: {response.text}")
except Exception as e:
    print(f"❌ Exception: {e}")
