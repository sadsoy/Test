# QC commands (run from the project folder, after the final mux)

```bash
V=deliver/<slug>_shorts.mp4
# spec: 1080x1920, 30/1, duration within the brief
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration:format=duration,size -of compact $V
# loudness: target -14 LUFS, peak <= -1.5 dBFS
ffmpeg -i $V -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
# jumps: per-frame difference; spikes outside intended moves/transitions are bugs (wipe pop-ins, snaps)
ffmpeg -loglevel error -i $V -vf "scale=180:320,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=out/check/diff.txt" -f null -
python3 -c "
import re,statistics;v=[float(x) for x in re.findall(r'YAVG=([\d.]+)',open('out/check/diff.txt').read())];m=statistics.median(v)
print('median',round(m,2));print([(round((i+1)/30,2),round(d,1)) for i,d in enumerate(v) if d>max(6,4*m)])"
# whole-film cut sheet: one frame every 1.5 s; read it
ffmpeg -y -loglevel error -i $V -vf "fps=2/3,scale=216:384,tile=10x3" -frames:v 1 out/check/cuts.jpg
```

## Voice over bed, per phrase (speech band)

Render the bed (ducked music + SFX) and the voice through the same chain as `audio.mjs`, band-limited to
300 Hz–4 kHz, then compare RMS over every phrase in `src/timing.js`. Every phrase should be at least 8 dB above the bed.

```bash
ffmpeg -y -loglevel error -i out/voice/narration.wav -i out/audio/music.wav -i out/audio/sfx.wav -filter_complex "[0:a]loudnorm=I=-16:TP=-2:LRA=11,aformat=channel_layouts=stereo,asplit=2[v][vk];[1:a]loudnorm=I=-25:TP=-6[m0];[m0][vk]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=450[m];[2:a]volume=-9dB[s];[m][s]amix=inputs=2:normalize=0,highpass=f=300,lowpass=f=4000[bed];[v]highpass=f=300,lowpass=f=4000[vo]" -map "[bed]" -ac 1 -ar 16000 out/check/bed.wav -map "[vo]" -ac 1 -ar 16000 out/check/vo.wav
python3 - <<'EOF'
import wave, struct, math, re
def rd(p):
    w=wave.open(p); n=w.getnframes(); return struct.unpack('<%dh'%n, w.readframes(n)), w.getframerate()
vo,sr=rd('out/check/vo.wav'); bed,_=rd('out/check/bed.wav')
ph=[tuple(map(float,m)) for m in re.findall(r'\[\s*([\d.]+),\s*([\d.]+)\s*\]', open('src/timing.js').read())]
rms=lambda x: math.sqrt(sum(v*v for v in x)/max(1,len(x)))+1e-9
for a,b in ph: print(f'{a:6.2f}-{b:6.2f} {20*math.log10(rms(vo[int(a*sr):int(b*sr)])/rms(bed[int(a*sr):int(b*sr)])):5.1f} dB')
EOF
```

## Checklist for the report

- Length is within the brief. The output is 1080×1920 at 30 fps, H.264 + AAC.
- Loudness is −14 LUFS, with peaks no higher than −1.5 dBFS.
- The voice is at least 8 dB above the bed on every phrase.
- No unintended frame-diff spikes. Check wipes with `--strip`.
- Nothing important under the subtitle card, off-frame, or under the Shorts UI.
- Subtitles never break a word, and words light up with the voice.
- No shape changes unexpectedly: everything is seeded and drawn as a function of t.
- No dead air longer than about 0.5 s except at the loop tail.
- The last frame matches the first (loop).
