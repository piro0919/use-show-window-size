# assets

`JetBrainsMono-800-subset.ttf` is the face drawn into the Open Graph card
(`src/app/opengraph-image.tsx`). It is the same display face the site uses for
its headings, cut down to the characters the card actually shows.

Any character missing from it silently falls back to a different face, so when
the card's copy changes, rebuild the subset:

```sh
curl -sL -o "/tmp/JetBrainsMono[wght].ttf" \
  "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"
fonttools varLib.instancer /tmp/JetBrainsMono[wght].ttf wght=800 -o /tmp/frozen.ttf

pyftsubset /tmp/frozen.ttf \
  --text="use-show-window-size React hook that shows the current window size while you develop. kkweb.io 1200x630" \
  --unicodes="U+0020-007E,U+00A0-00FF" \
  --output-file=assets/JetBrainsMono-800-subset.ttf \
  --no-hinting --desubroutinize --layout-features=''
```
