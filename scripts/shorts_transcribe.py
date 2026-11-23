"""QC for the narration: transcribe each take with Gemini (audio in, text out) so a wrong word, a skipped word or a
read-aloud stage direction shows up. usage: python3 -I scripts/shorts_transcribe.py <wav> [<wav> ...] [--model=...]"""
import json, os, sys, base64, urllib.request, time
model = next((a.split("=", 1)[1] for a in sys.argv[1:] if a.startswith("--model=")), "gemini-3.8-flash")
for f in [a for a in sys.argv[1:] if not a.startswith("--")]:
    body = {"contents": [{"role": "user", "parts": [
        {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(f, "rb").read()).decode()}},
        {"text": "Transcribe this audio verbatim in its original language(s). For each sentence give the start and end time in seconds. Output only lines like '0.00-1.20 text'."}]}]}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                                 json.dumps(body).encode(), {"x-goog-api-key": "placeholder", "Content-Type": "application/json"})
    for _ in range(5):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=180)); break
        except urllib.error.HTTPError as e:
            print("  http", e.code, e.read().decode()[:200]); time.sleep(20)
    else: continue
    print(os.path.basename(f), "::", "".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"]).strip())
