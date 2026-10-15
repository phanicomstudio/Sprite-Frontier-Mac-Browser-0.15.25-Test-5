/* MAINTAINER GUIDE
 * Unarmed Candy image and one-time alpha-bounds extraction. Four-direction metadata can be replaced by an eight-direction profile later without changing movement logic. The embedded image is generated asset data.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
window.FrontierCandyUnarmed = {
  id: "candy-unarmed",
  image: new Image(),
  frames: [
    { "x": 123, "y": 294, "w": 158, "h": 306, "anchorX": 77 },
    { "x": 523, "y": 294, "w": 158, "h": 306, "anchorX": 77 },
    { "x": 923, "y": 294, "w": 158, "h": 306, "anchorX": 77 },
    { "x": 122, "y": 600, "w": 174, "h": 596, "anchorX": 78 },
    { "x": 529, "y": 889, "w": 152, "h": 311, "anchorX": 71 },
    { "x": 929, "y": 600, "w": 150, "h": 600, "anchorX": 71 },
    { "x": 104, "y": 1489, "w": 174, "h": 306, "anchorX": 96 },
    { "x": 519, "y": 1489, "w": 159, "h": 311, "anchorX": 81 },
    { "x": 924, "y": 1489, "w": 154, "h": 310, "anchorX": 76 },
    { "x": 120, "y": 2090, "w": 158, "h": 310, "anchorX": 80 },
    { "x": 520, "y": 2090, "w": 158, "h": 309, "anchorX": 80 },
    { "x": 920, "y": 2090, "w": 158, "h": 310, "anchorX": 80 },
  ],
  direction: {
    rows: [3, 2, 0, 1],
    walkSequence: [1, 2, 1, 0],
    frameSeconds: 0.14,
    idleColumn: 1,
  },
};
// October 15, 2026 (0.15.27): the sheet file over http(s); from disk, its
// offline copy (characters bundle). The embedded copy was removed.
window.FrontierAssets.imageURL("img/characters/$Candy 1.png").then(
  /* @function candyUnarmed.sheetReady — Inputs: image URL or data URI. Returns nothing; assigns the unarmed Candy sheet. */ function (url) {
    FrontierCandyUnarmed.image.src = url;
  },
  /* @function candyUnarmed.sheetFailed — Inputs: load error. Returns nothing; logs why the unarmed sheet is unavailable. */ function (error) {
    console.error(error);
  },
);
