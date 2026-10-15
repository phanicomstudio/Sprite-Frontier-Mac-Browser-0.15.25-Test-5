# Sprite Frontier 0.15.10 — engine depth sorting

## Behavior
Event sprites, scenery and the player share the camera-depth drawing order. Removed RPG Maker Above/Same/Below controls from both event editors. Legacy priority fields remain readable for compatibility, but have no rendering effect. The user confirmed Same as player fixed the reported 0.15.9 overlap, corroborating the cause: a default Below priority forced new events behind farther scenery.

Blocks movement is now an explicit option, independent of drawing order. Through bypasses movement collision. Height and flying remain placement settings. Horizontal room faces retain their structural background pass. Water and terrain occlusion remain independent of sprite order.

## Verification
The cached source regression suite passed. Browser event creation/dialogue interaction passed with the priority control absent and collision checkbox available. Actual renderer sprite submissions passed 216 perspective cases covering terrain, yaw, pitch, distance and all three legacy priority values, including 12 underwater cases. A further 24 fixed-room cases passed. These assertions check actual draw submission order; they do not claim exhaustive pixel-level visual acceptance.

## Delivery and limits
Complete Windows and Mac browser packages accompany this iteration. Keep each extracted folder together. The Mac edition runs in a browser, not as a native app. Automated browser checks ran on Windows Chrome; macOS has not been tested. The user confirmed native Windows 0.15.9 opens and dialogue works. Native 0.15.10 remains unverified here because this environment previously denied Electron startup before rendering.

New iteration map storage is isolated from 0.15.9. Export/import remains the deliberate way to transfer an authored project. The full 0.15.9 source and packages are preserved.
