// Offline data mirror / generated asset payload. Edit its matching JSON or source image, then regenerate this mirror; preserve equality in tests.
window.FrontierPortraitData = {
  "image": "img/hud/portraits/candy-hud-portraits.png",
  "frames": { "neutral": { "x": 0, "y": 0, "width": 110, "height": 125 } },
  "healthBands": [
    { "min": 75, "state": "healthy", "frame": "neutral" },
    { "min": 40, "state": "hurt", "frame": "neutral" },
    { "min": 1, "state": "critical", "frame": "neutral" },
    { "min": 0, "state": "dead", "frame": "neutral" },
  ],
  "damage": { "frame": "neutral", "seconds": 0.6 },
  "idle": { "frames": ["neutral"], "frameSeconds": 0.5 },
  "background": "#141b14",
};
