"""QC for the narration cuts of a Short: join every line file with 1.2 s of silence between them and have Gemini
transcribe each silence-separated segment on its own line. A word cut in half or moved to the wrong line shows up at the
edge of a segment. (Transcribing each short line file alone proved unreliable: the model drops or invents words.)
usage: python3 -I scripts/shorts_checkcuts.py <lines dir> [model]"""
import sys, glob, json, base64, subprocess, urllib.request, time, os
d = sys.argv[1]; model = sys.argv[2] if len(sys.argv) > 2 else "gemini-3.5-flash"
files = sorted(glob.glob(f"{d}/n*.wav")); out = f"{d}/../checkcuts.wav"
inputs = sum((["-i", f] for f in files), []); n = len(files)
graph = "".join(f"[{i}:a]aresample=24000,aformat=channel_layouts=mono,apad=pad_dur=1.2[a{i}];" for i in range(n)) + "".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[o]"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "[o]", out], check=True)
prompt = (f"This Thai audio has exactly {n} spoken segments separated by long silences. Transcribe every segment verbatim on "
          f"its own line, numbered 1 to {n}, with nothing else. Keep every word, even a single cut-off syllable at a segment edge.")
body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(out, "rb").read()).decode()}}, {"text": prompt}]}]}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", json.dumps(body).encode(), {"x-goog-api-key": "placeholder", "Content-Type": "application/json"})
for _ in range(8):
    try: r = json.load(urllib.request.urlopen(req, timeout=300)); break
    except urllib.error.HTTPError as e: print("http", e.code, file=sys.stderr); time.sleep(20)
print("".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"]).strip())
