// October 12, 2026: authored castle prefab catalog; explicit editor loading only.
// October 15, 2026 (0.15.27): metadata only. Each model is its own GLB file at
// "path" and is loaded by src/prop-editor.js through FrontierAssets.bytes(); the
// embedded base64 copies were removed. Edit the GLB, not this file, for geometry.
window.FrontierCastleModels=[
 {
  "id": "castle-square-room-4m",
  "name": "Square Room 4m",
  "file": "Square_Room_4m.glb",
  "path": "assets/models/castle/Square_Room_4m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ],
   "top": [
    0,
    0,
    3
   ],
   "door": [
    0,
    -2.2,
    0
   ]
  },
  "dimensions": {
   "clearWidth": 4,
   "clearDepth": 4,
   "storyHeight": 3,
   "wallThickness": 0.2
  },
  "notes": "Open ceiling; next story floor or separate roof closes top. Door opening 1.2m x 2.1m.",
  "sha256": "7b0ade2580846b6d0d02d03f0b6b71835880e5118324c3c21c7dc47307c8ce33"
 },
 {
  "id": "castle-square-room-6m",
  "name": "Square Room 6m",
  "file": "Square_Room_6m.glb",
  "path": "assets/models/castle/Square_Room_6m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ],
   "top": [
    0,
    0,
    3
   ],
   "door": [
    0,
    -3.2,
    0
   ]
  },
  "dimensions": {
   "clearWidth": 6,
   "clearDepth": 6,
   "storyHeight": 3,
   "wallThickness": 0.2
  },
  "notes": "Open ceiling; next story floor or separate roof closes top. Door opening 1.2m x 2.1m.",
  "sha256": "5326d5a0bcae478121e0310c44bd5a28a136c065b9c4050ccd6ef3eb2b072623"
 },
 {
  "id": "castle-square-room-8m",
  "name": "Square Room 8m",
  "file": "Square_Room_8m.glb",
  "path": "assets/models/castle/Square_Room_8m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ],
   "top": [
    0,
    0,
    3
   ],
   "door": [
    0,
    -4.2,
    0
   ]
  },
  "dimensions": {
   "clearWidth": 8,
   "clearDepth": 8,
   "storyHeight": 3,
   "wallThickness": 0.2
  },
  "notes": "Open ceiling; next story floor or separate roof closes top. Door opening 1.2m x 2.1m.",
  "sha256": "7a42a5e4d01e65737165ddb88ecbbbfa3b40caa838db0f50b826e48c43d783f3"
 },
 {
  "id": "castle-tower-section-6m",
  "name": "Tower Section 6m",
  "file": "Tower_Section_6m.glb",
  "path": "assets/models/castle/Tower_Section_6m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ],
   "top": [
    0,
    0,
    3
   ],
   "door": [
    0,
    -3.2,
    0
   ]
  },
  "dimensions": {
   "clearDiameter": 6,
   "storyHeight": 3,
   "wallThickness": 0.2
  },
  "notes": "Hollow open-ended section; add circular floor modules independently. This permits stacked floor/stair openings.",
  "sha256": "1df55778291bc1be0b4b52c04f37c5ec7549546ba88743b857de66cc729f4698"
 },
 {
  "id": "castle-tower-section-8m",
  "name": "Tower Section 8m",
  "file": "Tower_Section_8m.glb",
  "path": "assets/models/castle/Tower_Section_8m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ],
   "top": [
    0,
    0,
    3
   ],
   "door": [
    0,
    -4.2,
    0
   ]
  },
  "dimensions": {
   "clearDiameter": 8,
   "storyHeight": 3,
   "wallThickness": 0.2
  },
  "notes": "Hollow open-ended section; add circular floor modules independently. This permits stacked floor/stair openings.",
  "sha256": "b6ee6bd5022aea7dc434ada266fabe11c1d5dfac193c1c20bbe8ab6fc5751167"
 },
 {
  "id": "castle-castle-wall-4m",
  "name": "Castle Wall 4m",
  "file": "Castle_Wall_4m.glb",
  "path": "assets/models/castle/Castle_Wall_4m.glb",
  "connectors": {
   "left": [
    -2,
    0,
    3
   ],
   "right": [
    2,
    0,
    3
   ]
  },
  "dimensions": {
   "width": 4,
   "depth": 1.2,
   "walkwayHeight": 3,
   "totalHeight": 3.8
  },
  "notes": "Walkable wall top with side parapets; end anchors continue the walkway.",
  "sha256": "ca2f8aa9f1ded6c2455bc01643f569b231c57e4654ee4608505fdcc9504dfabd"
 },
 {
  "id": "castle-castle-gable-roof-6m",
  "name": "Castle Gable Roof 6m",
  "file": "Castle_Gable_Roof_6m.glb",
  "path": "assets/models/castle/Castle_Gable_Roof_6m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ]
  },
  "dimensions": {
   "width": 6.4,
   "depth": 6.4,
   "height": 2.4
  },
  "notes": "Fits 6m square room including outer wall thickness. Solid roof volume; not a furnished attic.",
  "sha256": "7a5709a82632cd29fd69939c44c719b8c337551302d1e478c1780cfdeb298950"
 },
 {
  "id": "castle-tower-roof-6m",
  "name": "Tower Roof 6m",
  "file": "Tower_Roof_6m.glb",
  "path": "assets/models/castle/Tower_Roof_6m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ]
  },
  "dimensions": {
   "radius": 3.2,
   "height": 3
  },
  "notes": "Matches tower outer wall radius; solid roof cap. No attic or hatch in this variant.",
  "sha256": "cdc94ba1bfacad923b7caa90ea9711af08d74e08562e9c81a55274a914b311d7"
 },
 {
  "id": "castle-tower-roof-8m",
  "name": "Tower Roof 8m",
  "file": "Tower_Roof_8m.glb",
  "path": "assets/models/castle/Tower_Roof_8m.glb",
  "connectors": {
   "bottom": [
    0,
    0,
    0
   ]
  },
  "dimensions": {
   "radius": 4.2,
   "height": 3
  },
  "notes": "Matches tower outer wall radius; solid roof cap. No attic or hatch in this variant.",
  "sha256": "c0c0d972c24c49e1b7000d7265e14eacce10630f5145644ca6ba5664f9a87baf"
 }
];
