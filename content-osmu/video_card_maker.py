import os
import json
import requests
import PIL.Image
import socket
import time

# --- PATCH: Fix for Pillow 10+ removing ANTIALIAS ---
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS

from moviepy.editor import *
from PIL import Image, ImageFont, ImageDraw
import numpy as np

# --- Configuration ---
OUTPUT_DIR = "output_videos"
ASSETS_DIR = "../seo-blog/public/images/posts"
JSON_PATH = "../seo-blog/public/cards.json"
FONT_PATH = "C:/Windows/Fonts/malgunbd.ttf"
TTS_API_URL = "http://127.0.0.1:9882" # Port 9882
TTS_PORT = 9882

# Canvas Settings
WIDTH = 1080
HEIGHT = 1350
DURATION = 5

def check_api_status(host="127.0.0.1", port=9882):
    """Checks if the API server port is open."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def generate_tts(text, output_filename, ref_audio_path, prompt_text=""):
    """Calls the GPT-SoVITS API to generate audio with robust error handling."""
    print(f"   🎙️ TTS 생성 시도 중... (Target: {OUTPUT_DIR})")
    if not text or not ref_audio_path:
        return None
        
    try:
        os.makedirs(os.path.dirname(output_filename), exist_ok=True)
        
        payload = {
            "text": text,
            "text_lang": "ko",
            "refer_wav_path": os.path.abspath(ref_audio_path),
            "prompt_text": prompt_text,
            "prompt_lang": "ko",
            "text_split_method": "cut5",
            "batch_size": 1,
            "media_type": "wav",
            "streaming_mode": False
        }

        # Enhanced Timeout for busy servers (Training interference)
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"   🎙️ TTS Generation Attempt {attempt+1}/{max_retries}...")
                response = requests.post(TTS_API_URL, json=payload, timeout=30)
                
                # Success
                if response.status_code == 200:
                    with open(output_filename, "wb") as f:
                        f.write(response.content)
                    print(f"   ✅ TTS Generated: {output_filename}")
                    return output_filename
                    
                # Retry on Server Error
                if response.status_code >= 500:
                     print(f"   ⚠️ Server Error {response.status_code}. Retrying in 2s...")
                     time.sleep(2)
                     continue
                     
                print(f"   ❌ Client/API Error {response.status_code}: {response.text[:100]}")
                return None

            except requests.exceptions.Timeout:
                print(f"   ❌ API Timeout (30s). Retrying in 3s...")
                time.sleep(3)
            except requests.exceptions.ConnectionError:
                 print(f"   ❌ Connection Failed. Retrying in 3s...")
                 time.sleep(3)
            except Exception as e:
                print(f"   ❌ Unexpected Error: {e}")
                break
                
        return None

        # 3. Size Check (Empty file check)
        if len(response.content) < 1000:
            # Too small to be valid audio usually, check if it's a text error
            print(f"   ⚠️ Warning: Received data too small ({len(response.content)} bytes). Might be error text.")
            print(f"   Raw Content: {response.content[:200]}")
            # Depending on API, might still save to check, but usually it's failure.

        with open(output_filename, 'wb') as f:
            f.write(response.content)
            
        return output_filename
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection Failed. is the API Server (Port {TTS_PORT}) running?")
        print("      Possible Cause: WebUI 'Training' mode is active and blocking the API.")
        return None
    except requests.exceptions.Timeout:
        print(f"   ❌ API Timeout (60s). Server is overloaded or hanging.")
        print("      Possible Cause: 'Dataset Formatting' or Training task is consuming resources.")
        return None
    except Exception as e:
        print(f"   ❌ Unexpected Exception: {e}")
        return None

def create_text_image(card, width, height, font_paths):
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_tag, font_head, font_sub, font_cta = font_paths

    # Layout Math (50:50) & Safe Zones
    split_ratio = 0.50
    content_start_y = int(height * split_ratio)
    padding_x = 80
    bottom_safe_zone = 180

    if card['type'] == 'cover':
        content_start_y = height - bottom_safe_zone - 400
        draw.rectangle([(0, height*0.3), (width, height)], fill=(0,0,0,200)) 
    else:
        bg_color = (0, 0, 0, 255) if card['type'] != 'cta' else (10, 10, 0, 255)
        draw.rectangle([(0, content_start_y), (width, height)], fill=bg_color)
        line_color = (255, 215, 0, 255) if card['type'] == 'cta' else (51, 51, 51, 255)
        draw.rectangle([(0, content_start_y), (width, content_start_y+4)], fill=line_color)

    current_y = content_start_y + 100
    if card['type'] == 'cover': current_y = height - bottom_safe_zone - 400
    
    # 1. Tag
    tag_color = (255, 77, 77, 255)
    if card['type'] == 'cta': tag_color = (255, 215, 0, 255)
    
    draw.rectangle([(padding_x, current_y - 50), (padding_x + 220, current_y + 10)], fill=tag_color)
    tag_text_color = (0, 0, 0, 255) if card['type'] == 'cta' else (255, 255, 255, 255)
    draw.text((padding_x + 20, current_y - 40), card['tag'], font=font_tag, fill=tag_text_color)
    current_y += 80

    # 2. Headline
    head_color = (255, 215, 0, 255) if card['type'] == 'cta' else (255, 255, 255, 255)
    lines = card['headline'].split('\n')
    for i, line in enumerate(lines):
        color = head_color
        if card['type'] == 'cover' and i == card.get('highlightIdx', -1):
            color = (255, 235, 59, 255)
        draw.text((padding_x, current_y), line, font=font_head, fill=color)
        current_y += 85

    current_y += 30

    # 3. Subtext
    if 'subtext' in card:
        sub_lines = card.get('subtext', '').split('\n')
        for line in sub_lines:
            draw.text((padding_x, current_y), line, font=font_sub, fill=(187, 187, 187, 255))
            current_y += 55

    # 4. CTA
    if 'ctaText' in card:
        current_y += 40
        btn_rect = [(padding_x, current_y), (padding_x + 450, current_y + 100)]
        draw.rectangle(btn_rect, fill=(255, 215, 0, 255))
        draw.text((padding_x + 80, current_y + 25), card['ctaText'], font=font_cta, fill=(0,0,0,255))

    return np.array(img)

def main():
    if not os.path.exists(OUTPUT_DIR): os.makedirs(OUTPUT_DIR)
    
    print("\n🔍 Pre-flight Check: API Server Status")
    if not check_api_status(port=TTS_PORT):
        print(f"❌ Error: API Server (Port {TTS_PORT}) is NOT reachable.")
        print(f"⚠️  Please STOP active Training/Dataset tasks in WebUI and START the API server.")
        return
    else:
        print(f"✅ API Server is Online (Port {TTS_PORT}).")

    # Load Cards
    try:
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            cards = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load cards.json: {e}")
        return

    # Load Fonts
    try:
        fonts = (
            ImageFont.truetype(FONT_PATH, 30),
            ImageFont.truetype(FONT_PATH, 65),
            ImageFont.truetype(FONT_PATH, 36),
            ImageFont.truetype(FONT_PATH, 40)
        )
    except:
        print("⚠️ Warning: Fonts not found, using default.")
        default = ImageFont.load_default()
        fonts = (default, default, default, default)

    # Reference Audio
    ref_audio = r"c:\Users\happy\.gemini\antigravity\scratch\TTS-GPT-SoVITS\custom_dataset\organized\Anxious\[Anxious] 가족 모두 한 집에서 실종됐다._000644.wav"
    ref_text = "가족 모두 한 집에서 실종됐다."
    
    if not os.path.exists(ref_audio):
        print(f"❌ Critical: Ref Audio Not Found at {ref_audio}")
        return 

    print("🎬 Starting Video Generation Process...")

    for i, card in enumerate(cards):
        print(f"\n[{i+1}/{len(cards)}] Processing: {card['tag']}...")
        
        # 1. Visual Setup
        clip = None
        text_clip = None
        base = None
        final = None
        audio_clip = None
        
        generated_clips = [] # Keep track for cleanup

        try:
            asset_path = os.path.join(ASSETS_DIR, card['file'])
            if asset_path.endswith('.gif'):
                clip = VideoFileClip(asset_path).loop(duration=DURATION)
            else:
                clip = ImageClip(asset_path).set_duration(DURATION)
                
            if clip.w != WIDTH: clip = clip.resize(width=WIDTH)
            
            target_height = HEIGHT * 0.50
            if card['type'] == 'cover': target_height = HEIGHT
            if clip.h > target_height: clip = clip.crop(y1=0, height=target_height)
            
            clip = clip.set_position(('center', 'top'))

            # 2. Text Overlay
            base = ColorClip(size=(WIDTH, HEIGHT), color=(17,17,17), duration=DURATION)
            text_img = create_text_image(card, WIDTH, HEIGHT, fonts)
            text_clip = ImageClip(text_img).set_duration(DURATION)
            
            generated_clips.extend([clip, base, text_clip])

            # 3. Audio Logic (TTS)
            tts_text = card.get('tts_text')
            if not tts_text:
                print("   ⚠️ tts_text missing, using headline as fallback.")
                tts_text = card['headline'].replace('\n', ' ')
            
            if tts_text:
                tts_file = os.path.join(OUTPUT_DIR, f"tts_{i+1}.wav")
                print(f"   🎙️ Generating TTS: '{tts_text[:15]}...'")
                
                generated_path = generate_tts(tts_text, tts_file, ref_audio, ref_text)
                
                if generated_path and os.path.exists(generated_path):
                    # Validate File Size again to be sure
                    if os.path.getsize(generated_path) > 1000:
                        try:
                            audio_clip = AudioFileClip(generated_path)
                            print(f"   ✅ Audio loaded. Duration: {audio_clip.duration:.2f}s")
                            
                            # Handle duration mismatch
                            if audio_clip.duration > DURATION:
                                print(f"   ⚠️ Audio longer than video. Trimming to {DURATION}s.")
                                audio_clip = audio_clip.subclip(0, DURATION)
                            
                            generated_clips.append(audio_clip)

                        except Exception as e:
                            print(f"   ❌ Audio Load Error (File Corrupt?): {e}")
                            audio_clip = None
                    else:
                         print("   ❌ Generated file too small (likely error text). Skipping audio.")
                else:
                    print("   ❌ TTS Generation failed (connection/timeout/error).")

            # 4. Composite & Audio Assignment
            final = CompositeVideoClip([base, clip, text_clip])
            generated_clips.append(final)
            
            if audio_clip:
                final = final.set_audio(audio_clip)
                if final.audio:
                    print(f"   🔊 Audio attached successfully.")
                else:
                    print(f"   ❌ Failed to attach audio internal error.")
            else:
                print(f"   🔇 Proceeding WITHOUT audio.")

            # 5. Write to File
            output_filename = os.path.join(OUTPUT_DIR, f"card_{i+1}.mp4")
            
            final.write_videofile(
                output_filename, 
                fps=24, 
                codec='libx264', 
                audio_codec='aac', 
                temp_audiofile=f'temp-audio-{i+1}.m4a', 
                remove_temp=True, 
                threads=4,
                logger=None 
            )
            print(f"   ✅ Video saved: {output_filename}")

        except Exception as e:
            print(f"   ❌ Error processing card {i+1}: {e}")
            import traceback
            traceback.print_exc()

        finally:
            # 6. Strict Cleanup
            for c in generated_clips:
                try:
                    c.close()
                except:
                    pass

if __name__ == "__main__":
    main()
