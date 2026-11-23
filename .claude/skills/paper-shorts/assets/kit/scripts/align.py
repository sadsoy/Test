# align.py: ask Gemini to transcribe each silence-separated speech segment of the take and assign it to a script line,
# so PHR in split.mjs is set from what was actually said (and dropped or changed words are caught).
import json, base64, ssl, urllib.request, subprocess, re, sys
MODEL = sys.argv[1] if len(sys.argv) > 1 else 'gemini-3.5-flash'
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'out/voice/full.wav', '-ac', '1', '-ar', '16000', '-b:a', '48k', 'out/voice/full_small.mp3'], check=True)
log = subprocess.run(['ffmpeg', '-i', 'out/voice/full.wav', '-af', 'silencedetect=noise=-38dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'out/voice/full.wav'], capture_output=True, text=True).stdout)
segs = []
for i, a in enumerate(en):
    b = st[i + 1] if i + 1 < len(st) else dur          # the last phrase may run to the end of the file
    if b - a > .15: segs.append((a, b))
audio = base64.b64encode(open('out/voice/full_small.mp3', 'rb').read()).decode()
lines = json.load(open('scripts/lines.json'))
prompt = (f"This Thai narration audio has {len(segs)} speech segments separated by pauses (seconds):\n" + "\n".join(f"{i+1}: {a:.2f}-{b:.2f}" for i, (a, b) in enumerate(segs)) +
  "\n\nTranscribe what is spoken in EACH segment and say which script line it belongs to. Script:\n" + "\n".join(f"{l['id']}: {l['text']}" for l in lines) +
  '\n\nReply with JSON only: {"segments":[{"seg":1,"line":"L1","text":"..."}], "missing_words":"..."}')
body = {"contents": [{"parts": [{"inlineData": {"mimeType": "audio/mp3", "data": audio}}, {"text": prompt}]}], "generationConfig": {"temperature": 0, "responseMimeType": "application/json"}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent", data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "dummy"})
try: r = json.load(urllib.request.urlopen(req, context=ctx, timeout=300))
except urllib.error.HTTPError as e: print(e.read()[:300].decode()); sys.exit(1)
out = json.loads(r['candidates'][0]['content']['parts'][0]['text'])
for s in out['segments']: print(s['seg'], s['line'], s['text'])
print('missing:', out.get('missing_words'))
from collections import Counter
c = Counter(s['line'] for s in out['segments']); print('PHR =', [c.get(l['id'], 0) for l in lines])
