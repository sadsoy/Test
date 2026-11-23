"""Thai narration for a Short with Gemini TTS through the Gemini API (generativelanguage.googleapis.com, v1beta).
Same request shape as scripts/tts_dialog.py (Vertex), for machines without gcloud. The key is sent as x-goog-api-key;
on a cloud session the network proxy injects the real one, so a placeholder is enough.

usage: python3 -I scripts/shorts_tts.py <lines.json> <outdir> [voice] [model]
lines.json: {"key": {"text": "...", "style": "..."(optional)}, ...}. Writes <outdir>/<key>.wav (24 kHz mono), skips existing.
"""
import json, os, sys, time, base64, subprocess, urllib.request

lines = json.load(open(sys.argv[1])); outdir = sys.argv[2]
VOICE = sys.argv[3] if len(sys.argv) > 3 else "Charon"
MODEL = sys.argv[4] if len(sys.argv) > 4 else "gemini-3.8-flash-tts"
KEY = os.environ.get("GEMINI_API_KEY", "placeholder")
# Gemini TTS reads a style note aloud ("Read in Thai like ...: text" came out as English speech), so by default the
STYLE = ""                                                 # request is the text alone; a line may still set "style"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
os.makedirs(outdir, exist_ok=True)
for key, ln in lines.items():
    out = f"{outdir}/{key}.wav"
    if os.path.exists(out):
        print("skip (exists)", out); continue
    st = ln.get("style", STYLE); prompt = f"{st}: {ln['text']}" if st else ln["text"]
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
    req = urllib.request.Request(URL, json.dumps(body).encode(), {"x-goog-api-key": KEY, "Content-Type": "application/json"})
    r = None
    for attempt in range(6):                                 # the free tier allows a few requests a minute: wait on 429
        try:
            r = json.load(urllib.request.urlopen(req, timeout=180)); break
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 503): print("retry", key, e.code); time.sleep(25); continue
            print("FAIL", key, e.code, msg); break
    if r is None: continue
    d = r["candidates"][0]["content"]["parts"][0]["inlineData"]
    data = base64.b64decode(d["data"])
    if "wav" in d["mimeType"]:
        open(out, "xb").write(data)
    else:                                                    # raw PCM (audio/L16;rate=24000)
        rate = ([p.split("=")[1] for p in d["mimeType"].split(";") if p.strip().startswith("rate=")] or ["24000"])[0]
        p = subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "s16le", "-ar", rate, "-ac", "1", "-i", "-", out], input=data)
        assert p.returncode == 0, d["mimeType"]
    print("wrote", out)
