// Offline data mirror / generated asset payload. Edit its matching JSON or source image, then regenerate this mirror; preserve equality in tests.
// Offline mirror of project/settings.json; semantic equality checked by tests.
window.FrontierProject={
  "movement": {
    "playerSpeed": 3.2,
    "sprintMultiplier": 2,
    "playerCollisionRadius": 0.13,
    "maxAxisStep": 0.08,
    "walkFrameSeconds": 0.14
  },
  "weapon": {
    "id": "fixture-9mm",
    "name": "9mm test weapon",
    "magazineSize": 12,
    "damage": 8,
    "spreadRadians": 0.012,
    "firingModel": "projectile",
    "projectile": {
      "speed": 45,
      "range": 22,
      "lifetime": 2,
      "visualZ": 30
    }
  },
  "definitions": {
    "tree": {
      "radius": 0.34,
      "height": 4
    },
    "rock": {
      "radius": 0.5,
      "height": 0.85
    },
    "ruin": {
      "radius": 0.7,
      "height": 3.2
    },
    "monster": {
      "radius": 0.22,
      "height": 1.65,
      "maxHp": 24
    }
  },
  "demo": {
    "terrain": {
      "mode": "hills",
      "amplitude": 2.8,
      "frequency": 0.12
    },
    "sky": {
      "enabled": true,
      "layers": [
        {
          "id": "distant-ridge",
          "kind": "ridge",
          "color": "#17406c",
          "distance": 160,
          "height": 12,
          "parallax": 0.08,
          "speed": 0
        },
        {
          "id": "near-ridge",
          "kind": "ridge",
          "color": "#225ea0",
          "distance": 100,
          "height": 7,
          "parallax": 0.3,
          "speed": 0
        },
        {
          "id": "high-clouds",
          "kind": "cloud",
          "color": "#25528b",
          "distance": 220,
          "height": 65,
          "parallax": 0.02,
          "speed": 0.012
        },
        {
          "id": "low-clouds",
          "kind": "cloud",
          "color": "#497cc1",
          "distance": 170,
          "height": 34,
          "parallax": 0.06,
          "speed": 0.022
        }
      ]
    }
  }
};

