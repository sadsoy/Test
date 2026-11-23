# The whole narration as ONE take (one request: consistent voice, natural flow), split into lines later by split.mjs.
import json, ssl, base64, urllib.request, wave, os, re, sys
MODEL = os.environ.get('TTS_MODEL', 'gemini-3.1-flash-tts-preview'); VOICE = os.environ.get('TTS_VOICE', 'Puck')
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
text = '\n\n'.join(l['text'] for l in json.load(open('scripts/lines.json')))
body = {"contents": [{"parts": [{"text": text}]}], "generationConfig": {"responseModalities": ["AUDIO"],
        "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
      data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
try: r = json.load(urllib.request.urlopen(req, context=ctx, timeout=300))
except urllib.error.HTTPError as e: print(e.read()[:400].decode()); sys.exit(1)
part = r['candidates'][0]['content']['parts'][0]['inlineData']; pcm = base64.b64decode(part['data'])
out = sys.argv[1] if len(sys.argv) > 1 else 'out/voice/full.wav'
if pcm[:4] == b'RIFF': open(out, 'wb').write(pcm)
else:
    m = re.search(r'rate=(\d+)', part.get('mimeType', '')); rate = int(m.group(1)) if m else 24000
    with wave.open(out, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm)
print(out, part.get('mimeType'))
