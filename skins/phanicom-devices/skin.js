/* October 15, 2026 (0.15.28): the original Phanicom device art as a skin pack.
 * Geometry is measured from the 0.15.27 layout, so the interface looks exactly
 * as before: percentages of each image's width and height.
 *   controls  remote.png (830 x 1460) with three hotspot buttons
 *   portrait  portrait-chassis.png and portrait-lens.png (766 x 681) drawn over
 *             the Blood/Cerebral portrait
 *   status    status-tv.png (863 x 1364): weapon screen above, inspection below
 *   pause     pause-menu.png (4096 x 3072): menu plates and options area
 * unused-portrait-tv-a/b.png are earlier alternates kept with the pack. */
FrontierSkins.register({
  schema: "sprite-frontier-skin/1",
  id: "phanicom-devices",
  name: "Phanicom devices",
  controls: {
    image: "remote.png",
    hotspots: {
      journal: [60, 71.8, 11, 3.2],
      inventory: [76, 78.4, 10, 3.1],
      resume: [14.5, 31.7, 10, 4],
    },
  },
  portrait: { frames: ["portrait-chassis.png", "portrait-lens.png"] },
  status: {
    image: "status-tv.png",
    screens: { equipment: [32, 11, 30, 18], inspection: [32, 50, 30, 18] },
  },
  pause: {
    image: "pause-menu.png",
    menu: [26, 60, 48, 30.4],
    settings: [12, 8, 76, 84],
  },
});
