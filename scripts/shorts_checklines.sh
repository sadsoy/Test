#!/usr/bin/env bash
# shorts_checklines.sh: QC for the narration of a Short: transcribe every placed line file on its own, so a cut that
# lands mid-word shows up as a word missing at one end and appearing at the other. usage: scripts/shorts_checklines.sh <lines dir>
for f in "$1"/n*.wav; do
  for try in 1 2 3 4; do
    r=$(python3 -I scripts/shorts_transcribe.py "$f" --model=gemini-3.5-flash 2>/dev/null | grep "::")
    [ -n "$r" ] && break; sleep 15
  done
  echo "${r:-$(basename "$f") :: (no answer)}"
done
