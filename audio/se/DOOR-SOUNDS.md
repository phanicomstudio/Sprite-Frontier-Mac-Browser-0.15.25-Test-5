# Door sounds — October 9, 2026

Converted to OGG Vorbis quality 4, retaining source channels and sample rate.
Original MP3s remain untouched. All five converted files passed full decoding.

| Engine name | Original supplied filename |
|---|---|
| Door Open 01 | dragon-studio-opening-door-450444.mp3 |
| Door Open 02 | dragon-studio-door-opening-454242.mp3 |
| Door Close 01 | freesound_community-door-close-79921.mp3 |
| Door Close 02 | dragon-studio-close-door-382723.mp3 |
| Door Creak 01 | universfield-creaking-door-03-487855.mp3 |

Names classify the supplied filenames, not a listening assessment. Retain the
original providers' license/attribution records before public distribution.

`FrontierDoorAudio.select` supports random, manual and none independently for
opening and closing; creak is a separate optional cue. Random selection consumes
one choice at each phase boundary. Playback should use the existing bounded SE
voice pool. The new transition editor and phase playback integration remain
pending; these assets are already registered in the general sound picker.


## October 9, 2026 — integration complete

The earlier bank-only note is superseded: door transition controls now use these
registered OGG clips through the engine's existing bounded sound-effect pool.
Random selects within each open/close/creak role; Manual selects any registered
sound; Silent plays nothing. No per-frame audio allocations were introduced.
