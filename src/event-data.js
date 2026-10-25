// Offline data mirror / generated asset payload. Edit its matching JSON or source image, then regenerate this mirror; preserve equality in tests.
// Offline mirror of project/events.json
window.FrontierEventData = {
  "ammoTemplate": {
    "id": "template",
    "name": "Ammo box",
    "x": 24,
    "y": 24,
    "range": 1.8,
    "pages": [
      {
        "name": "Full",
        "graphic": "chest",
        "trigger": "interact",
        "solid": false,
        "condition": {
          "type": "always",
          "key": "",
        },
        "commands": [
          {
            "type": "giveItem",
            "item": "ammo9",
            "amount": 24,
          },
          {
            "type": "selfSwitch",
            "key": "A",
            "value": true,
          },
          {
            "type": "message",
            "text": "Collected 24 rounds of 9mm ammunition.",
          },
        ],
      },
      {
        "name": "Empty",
        "graphic": "openChest",
        "trigger": "interact",
        "solid": false,
        "condition": {
          "type": "selfSwitch",
          "key": "A",
        },
        "commands": [
          {
            "type": "message",
            "text": "This ammo box is empty.",
          },
        ],
      },
    ],
  },
  "initialEvents": [
    {
      "id": "ammo-west",
      "name": "Ammo box",
      "x": 22,
      "y": 25,
      "range": 1.8,
      "pages": [
        {
          "name": "Full",
          "graphic": "chest",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "always",
            "key": "",
          },
          "commands": [
            {
              "type": "giveItem",
              "item": "ammo9",
              "amount": 24,
            },
            {
              "type": "selfSwitch",
              "key": "A",
              "value": true,
            },
            {
              "type": "message",
              "text": "Collected 24 rounds of 9mm ammunition.",
            },
          ],
        },
        {
          "name": "Empty",
          "graphic": "openChest",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "selfSwitch",
            "key": "A",
          },
          "commands": [
            {
              "type": "message",
              "text": "This ammo box is empty.",
            },
          ],
        },
      ],
    },
    {
      "id": "ammo-east",
      "name": "Ammo box",
      "x": 26,
      "y": 25,
      "range": 1.8,
      "pages": [
        {
          "name": "Full",
          "graphic": "chest",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "always",
            "key": "",
          },
          "commands": [
            {
              "type": "giveItem",
              "item": "ammo9",
              "amount": 24,
            },
            {
              "type": "selfSwitch",
              "key": "A",
              "value": true,
            },
            {
              "type": "message",
              "text": "Collected 24 rounds of 9mm ammunition.",
            },
          ],
        },
        {
          "name": "Empty",
          "graphic": "openChest",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "selfSwitch",
            "key": "A",
          },
          "commands": [
            {
              "type": "message",
              "text": "This ammo box is empty.",
            },
          ],
        },
      ],
    },
    {
      "id": "ammo-north",
      "name": "Ammo box",
      "x": 24,
      "y": 27,
      "range": 1.8,
      "pages": [
        {
          "name": "Full",
          "graphic": "chest",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "always",
            "key": "",
          },
          "commands": [
            {
              "type": "giveItem",
              "item": "ammo9",
              "amount": 24,
            },
            {
              "type": "selfSwitch",
              "key": "A",
              "value": true,
            },
            {
              "type": "message",
              "text": "Collected 24 rounds of 9mm ammunition.",
            },
          ],
        },
        {
          "name": "Empty",
          "graphic": "openChest",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "selfSwitch",
            "key": "A",
          },
          "commands": [
            {
              "type": "message",
              "text": "This ammo box is empty.",
            },
          ],
        },
      ],
    },
    {
      "id": "guide",
      "name": "Frontier guide",
      "x": 24,
      "y": 26,
      "range": 1.8,
      "pages": [
        {
          "name": "Page 1",
          "graphic": "npc",
          "trigger": "interact",
          "solid": false,
          "condition": {
            "type": "always",
            "key": "",
          },
          "commands": [
            {
              "type": "message",
              "text":
                "Preset test scene: labelled ammo boxes beside the start; hills ahead/right; moving clouds above. Move the mouse to look and click once to capture. Space holsters, then left-click or controller A interacts. E or controller B jumps. Tab opens HUD cursor mode; F2 opens the in-level editor.",
            },
          ],
        },
      ],
    },
  ],
};
