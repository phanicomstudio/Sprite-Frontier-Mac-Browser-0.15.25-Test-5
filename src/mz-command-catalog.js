/* Palette ordering transcribed from the four user-supplied MZ screenshots.
 * Numeric codes verified against the supplied MZ 1.8.0 runtime. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-catalog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzcatalog. */
(/* @function mz-command-catalog.installReviewed — Publishes MZ-style command palette ordering and numeric-code metadata from the supplied editor references. Catalog visibility does not promise unsupported commands execute; execution validation remains separate. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  root.FrontierMZCatalog = [
    {
      "tab": 1,
      "column": 0,
      "label": "Message",
      "commands": [
        {
          "code": 101,
          "name": "Show Text",
        },
        {
          "code": 102,
          "name": "Show Choices",
        },
        {
          "code": 103,
          "name": "Input Number",
        },
        {
          "code": 104,
          "name": "Select Item",
        },
        {
          "code": 105,
          "name": "Show Scrolling Text",
        },
      ],
    },
    {
      "tab": 1,
      "column": 0,
      "label": "Game Progression",
      "commands": [
        {
          "code": 121,
          "name": "Control Switches",
        },
        {
          "code": 122,
          "name": "Control Variables",
        },
        {
          "code": 123,
          "name": "Control Self Switch",
        },
        {
          "code": 124,
          "name": "Control Timer",
        },
      ],
    },
    {
      "tab": 1,
      "column": 0,
      "label": "Flow Control",
      "commands": [
        {
          "code": 111,
          "name": "Conditional Branch",
        },
        {
          "code": 112,
          "name": "Loop",
        },
        {
          "code": 113,
          "name": "Break Loop",
        },
        {
          "code": 115,
          "name": "Exit Event Processing",
        },
        {
          "code": 117,
          "name": "Common Event",
        },
        {
          "code": 118,
          "name": "Label",
        },
        {
          "code": 119,
          "name": "Jump to Label",
        },
        {
          "code": 108,
          "name": "Comment",
        },
      ],
    },
    {
      "tab": 1,
      "column": 1,
      "label": "Party",
      "commands": [
        {
          "code": 125,
          "name": "Change Gold",
        },
        {
          "code": 126,
          "name": "Change Items",
        },
        {
          "code": 127,
          "name": "Change Weapons",
        },
        {
          "code": 128,
          "name": "Change Armors",
        },
        {
          "code": 129,
          "name": "Change Party Member",
        },
      ],
    },
    {
      "tab": 1,
      "column": 1,
      "label": "Actor",
      "commands": [
        {
          "code": 311,
          "name": "Change HP",
        },
        {
          "code": 312,
          "name": "Change MP",
        },
        {
          "code": 326,
          "name": "Change TP",
        },
        {
          "code": 313,
          "name": "Change State",
        },
        {
          "code": 314,
          "name": "Recover All",
        },
        {
          "code": 315,
          "name": "Change EXP",
        },
        {
          "code": 316,
          "name": "Change Level",
        },
        {
          "code": 317,
          "name": "Change Parameter",
        },
        {
          "code": 318,
          "name": "Change Skill",
        },
        {
          "code": 319,
          "name": "Change Equipment",
        },
        {
          "code": 320,
          "name": "Change Name",
        },
        {
          "code": 321,
          "name": "Change Class",
        },
        {
          "code": 324,
          "name": "Change Nickname",
        },
        {
          "code": 325,
          "name": "Change Profile",
        },
      ],
    },
    {
      "tab": 2,
      "column": 0,
      "label": "Movement",
      "commands": [
        {
          "code": 201,
          "name": "Transfer Player",
        },
        {
          "code": 202,
          "name": "Set Vehicle Location",
        },
        {
          "code": 203,
          "name": "Set Event Location",
        },
        {
          "code": 204,
          "name": "Scroll Map",
        },
        {
          "code": 205,
          "name": "Set Movement Route",
        },
        {
          "code": 206,
          "name": "Get on/off Vehicle",
        },
      ],
    },
    {
      "tab": 2,
      "column": 0,
      "label": "Character",
      "commands": [
        {
          "code": 211,
          "name": "Change Transparency",
        },
        {
          "code": 216,
          "name": "Change Player Followers",
        },
        {
          "code": 217,
          "name": "Gather Followers",
        },
        {
          "code": 212,
          "name": "Show Animation",
        },
        {
          "code": 213,
          "name": "Show Balloon Icon",
        },
        {
          "code": 214,
          "name": "Erase Event",
        },
      ],
    },
    {
      "tab": 2,
      "column": 0,
      "label": "Picture",
      "commands": [
        {
          "code": 231,
          "name": "Show Picture",
        },
        {
          "code": 232,
          "name": "Move Picture",
        },
        {
          "code": 233,
          "name": "Rotate Picture",
        },
        {
          "code": 234,
          "name": "Tint Picture",
        },
        {
          "code": 235,
          "name": "Erase Picture",
        },
      ],
    },
    {
      "tab": 2,
      "column": 1,
      "label": "Timing",
      "commands": [
        {
          "code": 230,
          "name": "Wait",
        },
      ],
    },
    {
      "tab": 2,
      "column": 1,
      "label": "Screen",
      "commands": [
        {
          "code": 221,
          "name": "Fadeout Screen",
        },
        {
          "code": 222,
          "name": "Fadein Screen",
        },
        {
          "code": 223,
          "name": "Tint Screen",
        },
        {
          "code": 224,
          "name": "Flash Screen",
        },
        {
          "code": 225,
          "name": "Shake Screen",
        },
        {
          "code": 236,
          "name": "Set Weather Effect",
        },
      ],
    },
    {
      "tab": 2,
      "column": 1,
      "label": "Audio & Video",
      "commands": [
        {
          "code": 241,
          "name": "Play BGM",
        },
        {
          "code": 242,
          "name": "Fadeout BGM",
        },
        {
          "code": 243,
          "name": "Save BGM",
        },
        {
          "code": 244,
          "name": "Resume BGM",
        },
        {
          "code": 245,
          "name": "Play BGS",
        },
        {
          "code": 246,
          "name": "Fadeout BGS",
        },
        {
          "code": 249,
          "name": "Play ME",
        },
        {
          "code": 250,
          "name": "Play SE",
        },
        {
          "code": 251,
          "name": "Stop SE",
        },
        {
          "code": 261,
          "name": "Play Movie",
        },
      ],
    },
    {
      "tab": 3,
      "column": 0,
      "label": "Scene Control",
      "commands": [
        {
          "code": 301,
          "name": "Battle Processing",
        },
        {
          "code": 302,
          "name": "Shop Processing",
        },
        {
          "code": 303,
          "name": "Name Input Processing",
        },
        {
          "code": 351,
          "name": "Open Menu Screen",
        },
        {
          "code": 352,
          "name": "Open Save Screen",
        },
        {
          "code": 353,
          "name": "Game Over",
        },
        {
          "code": 354,
          "name": "Return to Title Screen",
        },
      ],
    },
    {
      "tab": 3,
      "column": 0,
      "label": "System Settings",
      "commands": [
        {
          "code": 132,
          "name": "Change Battle BGM",
        },
        {
          "code": 133,
          "name": "Change Victory ME",
        },
        {
          "code": 139,
          "name": "Change Defeat ME",
        },
        {
          "code": 140,
          "name": "Change Vehicle BGM",
        },
        {
          "code": 134,
          "name": "Change Save Access",
        },
        {
          "code": 135,
          "name": "Change Menu Access",
        },
        {
          "code": 136,
          "name": "Change Encounter",
        },
        {
          "code": 137,
          "name": "Change Formation Access",
        },
        {
          "code": 138,
          "name": "Change Window Color",
        },
        {
          "code": 322,
          "name": "Change Actor Images",
        },
        {
          "code": 323,
          "name": "Change Vehicle Image",
        },
      ],
    },
    {
      "tab": 3,
      "column": 1,
      "label": "Map",
      "commands": [
        {
          "code": 281,
          "name": "Change Map Name Display",
        },
        {
          "code": 282,
          "name": "Change Tileset",
        },
        {
          "code": 283,
          "name": "Change Battle Background",
        },
        {
          "code": 284,
          "name": "Change Parallax",
        },
        {
          "code": 285,
          "name": "Get Location Info",
        },
      ],
    },
    {
      "tab": 3,
      "column": 1,
      "label": "Battle",
      "commands": [
        {
          "code": 331,
          "name": "Change Enemy HP",
        },
        {
          "code": 332,
          "name": "Change Enemy MP",
        },
        {
          "code": 342,
          "name": "Change Enemy TP",
        },
        {
          "code": 333,
          "name": "Change Enemy State",
        },
        {
          "code": 334,
          "name": "Enemy Recover All",
        },
        {
          "code": 335,
          "name": "Enemy Appear",
        },
        {
          "code": 336,
          "name": "Enemy Transform",
        },
        {
          "code": 337,
          "name": "Show Battle Animation",
        },
        {
          "code": 339,
          "name": "Force Action",
        },
        {
          "code": 340,
          "name": "Abort Battle",
        },
      ],
    },
    {
      "tab": 3,
      "column": 1,
      "label": "Advanced",
      "commands": [
        {
          "code": 355,
          "name": "Script",
        },
        {
          "code": 357,
          "name": "Plugin Command",
        },
      ],
    },
  ];
})(typeof window === "undefined" ? globalThis : window);
