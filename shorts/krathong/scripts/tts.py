# Thai narration via Gemini TTS (generativelanguage API; the proxy injects the key). One WAV per line.
import re, json, sys, ssl, base64, urllib.request, wave, os, time
MODEL = os.environ.get('TTS_MODEL', 'gemini-3.8-flash-tts')
VOICE = os.environ.get('TTS_VOICE', 'Puck')
STYLE = os.environ.get("TTS_STYLE", "")
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
lines = json.load(open('scripts/lines.json'))
only = sys.argv[1:]
os.makedirs('out/voice', exist_ok=True)
for L in lines:
    if only and L['id'] not in only: continue
    out = f"out/voice/{L['id']}.wav"
    body = {"contents": [{"parts": [{"text": STYLE + L['text']}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
              "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
    for attempt in range(4):
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
            r = json.load(urllib.request.urlopen(req, context=ctx, timeout=120))
            part = r['candidates'][0]['content']['parts'][0]['inlineData']
            pcm = base64.b64decode(part['data']); break
        except Exception as e:
            print(L['id'], 'retry', attempt, e, file=sys.stderr); time.sleep(3 * (attempt + 1))
    else: sys.exit(1)
    if pcm[:4] == b'RIFF': open(out, 'wb').write(pcm)          # newer models return a WAV container
    else:
        m = re.search(r'rate=(\d+)', part.get('mimeType', '')); rate = int(m.group(1)) if m else 24000
        with wave.open(out, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm)
    print(out, part.get('mimeType'))
