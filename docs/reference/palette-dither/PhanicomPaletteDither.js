/*:
 * @target MZ
 * @plugindesc v2.0 Fallout-inspired indexed palette and ordered dithering filter.
 * @author Phanicom / OpenAI
 *
 * @param Palette Mode
 * @text Palette Mode
 * @type select
 * @option Quake 256
 * @value Quake256
 * @option Fallout-Inspired Warm
 * @value FalloutWarm
 * @default FalloutWarm
 *
 * @param Dither Matrix
 * @text Dither Matrix
 * @type select
 * @option 4x4 Bayer
 * @value 4
 * @option 8x8 Bayer
 * @value 8
 * @default 8
 *
 * @param Dither Strength
 * @text Dither Strength
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.82
 *
 * @param Dither Scale
 * @text Dither Scale
 * @type number
 * @min 1
 * @max 8
 * @default 1
 * @desc Size of one dither cell in screen pixels.
 *
 * @param Gamma
 * @text Gamma
 * @type number
 * @decimals 2
 * @min 1
 * @max 3
 * @default 2.20
 *
 * @param Warmth
 * @text Warmth
 * @type number
 * @decimals 2
 * @min -0.5
 * @max 0.5
 * @default 0.08
 *
 * @param Saturation
 * @text Saturation
 * @type number
 * @decimals 2
 * @min 0
 * @max 2
 * @default 0.92
 *
 * @param Contrast
 * @text Contrast
 * @type number
 * @decimals 2
 * @min 0.5
 * @max 2
 * @default 1.06
 *
 * @param Shadow Protection
 * @text Shadow Protection
 * @type number
 * @decimals 3
 * @min 0
 * @max 0.5
 * @default 0.065
 * @desc Reduces dithering in deep shadows.
 *
 * @param Pair Quality
 * @text Pair Quality
 * @type number
 * @decimals 2
 * @min 0.5
 * @max 12
 * @default 5.00
 * @desc Higher values reject poor second-color matches more aggressively.
 *
 * @param Apply To UI
 * @text Apply To UI
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @command SetDitherScale
 * @text Set Dither Scale
 *
 * @arg scale
 * @text Scale
 * @type number
 * @min 1
 * @max 8
 * @default 1
 *
 * @command SetDitherStrength
 * @text Set Dither Strength
 *
 * @arg strength
 * @text Strength
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.82
 *
 * @command SetPaletteMode
 * @text Set Palette Mode
 *
 * @arg mode
 * @text Mode
 * @type select
 * @option Quake 256
 * @value Quake256
 * @option Fallout-Inspired Warm
 * @value FalloutWarm
 * @default FalloutWarm
 *
 * @help
 * PhanicomPaletteDither.js
 *
 * A screen-space palette-indexing filter for RPG Maker MZ using PIXI.
 *
 * Features:
 * - 256-color indexed output
 * - 4x4 or 8x8 ordered Bayer dithering
 * - Adjustable dither scale and strength
 * - Gamma-aware palette matching
 * - Two-color palette-pair dithering
 * - Warm Fallout-inspired palette mode
 * - Shadow protection
 * - Optional UI filtering
 *
 * INSTALLATION
 * 1. Copy PhanicomPaletteDither.js into js/plugins/
 * 2. Disable the older Quake256Palette and Quake256PaletteDither plugins.
 * 3. Add and enable PhanicomPaletteDither.
 *
 * RECOMMENDED FALLOUT-LIKE SETTINGS
 * Palette Mode: Fallout-Inspired Warm
 * Dither Matrix: 8x8 Bayer
 * Dither Strength: 0.82
 * Dither Scale: 1
 * Gamma: 2.20
 * Warmth: 0.08
 * Saturation: 0.92
 * Contrast: 1.06
 * Shadow Protection: 0.065
 * Pair Quality: 5.00
 */

(() => {
    "use strict";

    const pluginName = "PhanicomPaletteDither";
    const p = PluginManager.parameters(pluginName);

    const settings = {
        paletteMode: String(p["Palette Mode"] || "FalloutWarm"),
        matrixSize: Number(p["Dither Matrix"] || 8),
        ditherStrength: Number(p["Dither Strength"] || 0.82),
        ditherScale: Number(p["Dither Scale"] || 1),
        gamma: Number(p["Gamma"] || 2.20),
        warmth: Number(p["Warmth"] || 0.08),
        saturation: Number(p["Saturation"] || 0.92),
        contrast: Number(p["Contrast"] || 1.06),
        shadowProtection: Number(p["Shadow Protection"] || 0.065),
        pairQuality: Number(p["Pair Quality"] || 5.0),
        applyToUi: String(p["Apply To UI"] || "true") === "true"
    };

    const BASE_QUAKE_PALETTE = [
            "000000",
            "0f0f0f",
            "1f1f1f",
            "2f2f2f",
            "3f3f3f",
            "4b4b4b",
            "5b5b5b",
            "6b6b6b",
            "7b7b7b",
            "8b8b8b",
            "9b9b9b",
            "ababab",
            "bbbbbb",
            "cbcbcb",
            "dbdbdb",
            "ebebeb",
            "0f0b07",
            "170f0b",
            "1f170b",
            "271b0f",
            "2f2313",
            "372b17",
            "3f2f17",
            "4b371b",
            "533b1b",
            "5b431f",
            "634b1f",
            "6b531f",
            "73571f",
            "7b5f23",
            "836723",
            "8f6f23",
            "0b0b0f",
            "13131b",
            "1b1b27",
            "272733",
            "2f2f3f",
            "37374b",
            "3f3f57",
            "474767",
            "4f4f73",
            "5b5b7f",
            "63638b",
            "6b6b97",
            "7373a3",
            "7b7baf",
            "8383bb",
            "8b8bcb",
            "000000",
            "070700",
            "0b0b00",
            "131300",
            "1b1b00",
            "232300",
            "2b2b07",
            "2f2f07",
            "373707",
            "3f3f07",
            "474707",
            "4b4b0b",
            "53530b",
            "5b5b0b",
            "63630b",
            "6b6b0f",
            "070000",
            "0f0000",
            "170000",
            "1f0000",
            "270000",
            "2f0000",
            "370000",
            "3f0000",
            "470000",
            "4f0000",
            "570000",
            "5f0000",
            "670000",
            "6f0000",
            "770000",
            "7f0000",
            "131300",
            "1b1b00",
            "232300",
            "2f2b00",
            "372f00",
            "433700",
            "4b3b07",
            "574307",
            "5f4707",
            "6b4b0b",
            "77530f",
            "835713",
            "8b5b13",
            "975f1b",
            "a3631f",
            "af6723",
            "231307",
            "2f170b",
            "3b1f0f",
            "4b2313",
            "572b17",
            "632f1f",
            "733723",
            "7f3b2b",
            "8f4333",
            "9f4f33",
            "af632f",
            "bf772f",
            "cf8f2b",
            "dfab27",
            "efcb1f",
            "fff31b",
            "0b0700",
            "1b1300",
            "2b230f",
            "372b13",
            "47331b",
            "533723",
            "633f2b",
            "6f4733",
            "7f533f",
            "8b5f47",
            "9b6b53",
            "a77b5f",
            "b7876b",
            "c3937b",
            "d3a38b",
            "e3b397",
            "ab8ba3",
            "9f7f97",
            "937387",
            "8b677b",
            "7f5b6f",
            "775363",
            "6b4b57",
            "5f3f4b",
            "573743",
            "4b2f37",
            "43272f",
            "371f23",
            "2b171b",
            "231313",
            "170b0b",
            "0f0707",
            "bb739f",
            "af6b8f",
            "a35f83",
            "975777",
            "8b4f6b",
            "7f4b5f",
            "734353",
            "6b3b4b",
            "5f333f",
            "532b37",
            "47232b",
            "3b1f23",
            "2f171b",
            "231313",
            "170b0b",
            "0f0707",
            "dbc3bb",
            "cbb3a7",
            "bfa39b",
            "af978b",
            "a3877b",
            "977b6f",
            "876f5f",
            "7b6353",
            "6b5747",
            "5f4b3b",
            "533f33",
            "433327",
            "372b1f",
            "271f17",
            "1b130f",
            "0f0b07",
            "6f837b",
            "677b6f",
            "5f7367",
            "576b5f",
            "4f6357",
            "475b4f",
            "3f5347",
            "374b3f",
            "2f4337",
            "2b3b2f",
            "233327",
            "1f2b1f",
            "172317",
            "0f1b13",
            "0b130b",
            "070b07",
            "fff31b",
            "efdf17",
            "dbcb13",
            "cbb70f",
            "bba70f",
            "ab970b",
            "9b8307",
            "8b7307",
            "7b6307",
            "6b5300",
            "5b4700",
            "4b3700",
            "3b2b00",
            "2b1f00",
            "1b0f00",
            "0b0700",
            "0000ff",
            "0b0bef",
            "1313df",
            "1b1bcf",
            "2323bf",
            "2b2baf",
            "2f2f9f",
            "2f2f8f",
            "2f2f7f",
            "2f2f6f",
            "2f2f5f",
            "2b2b4f",
            "23233f",
            "1b1b2f",
            "13131f",
            "0b0b0f",
            "2b0000",
            "3b0000",
            "4b0700",
            "5f0700",
            "6f0f00",
            "7f1707",
            "931f07",
            "a3270b",
            "b7330f",
            "c34b1b",
            "cf632b",
            "db7f3b",
            "e3974f",
            "e7ab5f",
            "efbf77",
            "f7d38b",
            "a77b3b",
            "b79b37",
            "c7c337",
            "e7e357",
            "7fbfff",
            "abe7ff",
            "d7ffff",
            "670000",
            "8b0000",
            "b30000",
            "d70000",
            "ff0000",
            "fff393",
            "fff7c7",
            "ffffff",
            "9f5b53"
    ];

    function hexToRgb01(hex) {
        const n = parseInt(hex, 16);
        return [
            ((n >> 16) & 255) / 255,
            ((n >> 8) & 255) / 255,
            (n & 255) / 255
        ];
    }

    function clamp01(v) {
        return Math.max(0, Math.min(1, v));
    }

    function makePalette(mode) {
        return BASE_QUAKE_PALETTE.map(hex => {
            let [r, g, b] = hexToRgb01(hex);

            if (mode === "FalloutWarm") {
                const y = r * 0.299 + g * 0.587 + b * 0.114;
                r = clamp01(r * 1.08 + y * 0.025);
                g = clamp01(g * 0.98 + y * 0.015);
                b = clamp01(b * 0.82);
                g = clamp01(g + Math.max(0, y - 0.18) * 0.015);
            }

            return [r, g, b];
        });
    }

    const vertexShader = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4(
                (projectionMatrix * vec3(aVertexPosition, 1.0)).xy,
                0.0,
                1.0
            );
            vTextureCoord = aTextureCoord;
        }
    `;

    const fragmentShader = `
        precision highp float;

        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform vec3 palette[256];
        uniform float paletteSize;
        uniform float matrixSize;
        uniform float ditherStrength;
        uniform float ditherScale;
        uniform float gammaValue;
        uniform float warmth;
        uniform float saturation;
        uniform float contrast;
        uniform float shadowProtection;
        uniform float pairQuality;
        uniform vec4 inputSize;

        float bayer4(vec2 pos) {
            vec2 p = mod(floor(pos / ditherScale), 4.0);
            float x = p.x;
            float y = p.y;
            float v = 0.0;

            if (y < 1.0) {
                if (x < 1.0) v = 0.0;
                else if (x < 2.0) v = 8.0;
                else if (x < 3.0) v = 2.0;
                else v = 10.0;
            } else if (y < 2.0) {
                if (x < 1.0) v = 12.0;
                else if (x < 2.0) v = 4.0;
                else if (x < 3.0) v = 14.0;
                else v = 6.0;
            } else if (y < 3.0) {
                if (x < 1.0) v = 3.0;
                else if (x < 2.0) v = 11.0;
                else if (x < 3.0) v = 1.0;
                else v = 9.0;
            } else {
                if (x < 1.0) v = 15.0;
                else if (x < 2.0) v = 7.0;
                else if (x < 3.0) v = 13.0;
                else v = 5.0;
            }
            return (v + 0.5) / 16.0;
        }

        float bayer8(vec2 pos) {
            vec2 p = mod(floor(pos / ditherScale), 8.0);
            float x = p.x;
            float y = p.y;
            float v = 0.0;

            if (y < 1.0) {
                if (x < 1.0) v=0.0; else if (x<2.0) v=32.0; else if (x<3.0) v=8.0; else if (x<4.0) v=40.0;
                else if (x<5.0) v=2.0; else if (x<6.0) v=34.0; else if (x<7.0) v=10.0; else v=42.0;
            } else if (y < 2.0) {
                if (x < 1.0) v=48.0; else if (x<2.0) v=16.0; else if (x<3.0) v=56.0; else if (x<4.0) v=24.0;
                else if (x<5.0) v=50.0; else if (x<6.0) v=18.0; else if (x<7.0) v=58.0; else v=26.0;
            } else if (y < 3.0) {
                if (x < 1.0) v=12.0; else if (x<2.0) v=44.0; else if (x<3.0) v=4.0; else if (x<4.0) v=36.0;
                else if (x<5.0) v=14.0; else if (x<6.0) v=46.0; else if (x<7.0) v=6.0; else v=38.0;
            } else if (y < 4.0) {
                if (x < 1.0) v=60.0; else if (x<2.0) v=28.0; else if (x<3.0) v=52.0; else if (x<4.0) v=20.0;
                else if (x<5.0) v=62.0; else if (x<6.0) v=30.0; else if (x<7.0) v=54.0; else v=22.0;
            } else if (y < 5.0) {
                if (x < 1.0) v=3.0; else if (x<2.0) v=35.0; else if (x<3.0) v=11.0; else if (x<4.0) v=43.0;
                else if (x<5.0) v=1.0; else if (x<6.0) v=33.0; else if (x<7.0) v=9.0; else v=41.0;
            } else if (y < 6.0) {
                if (x < 1.0) v=51.0; else if (x<2.0) v=19.0; else if (x<3.0) v=59.0; else if (x<4.0) v=27.0;
                else if (x<5.0) v=49.0; else if (x<6.0) v=17.0; else if (x<7.0) v=57.0; else v=25.0;
            } else if (y < 7.0) {
                if (x < 1.0) v=15.0; else if (x<2.0) v=47.0; else if (x<3.0) v=7.0; else if (x<4.0) v=39.0;
                else if (x<5.0) v=13.0; else if (x<6.0) v=45.0; else if (x<7.0) v=5.0; else v=37.0;
            } else {
                if (x < 1.0) v=63.0; else if (x<2.0) v=31.0; else if (x<3.0) v=55.0; else if (x<4.0) v=23.0;
                else if (x<5.0) v=61.0; else if (x<6.0) v=29.0; else if (x<7.0) v=53.0; else v=21.0;
            }
            return (v + 0.5) / 64.0;
        }

        vec3 preprocess(vec3 c) {
            c = pow(max(c, vec3(0.0)), vec3(gammaValue));
            float luma = dot(c, vec3(0.299, 0.587, 0.114));

            c.r += warmth * 0.12;
            c.b -= warmth * 0.10;

            c = mix(vec3(luma), c, saturation);
            c = (c - 0.5) * contrast + 0.5;

            return clamp(c, 0.0, 1.0);
        }

        void main(void) {
            vec4 source = texture2D(uSampler, vTextureCoord);
            if (source.a <= 0.0) {
                gl_FragColor = source;
                return;
            }

            vec3 rgb = preprocess(source.rgb);
            float luma = dot(rgb, vec3(0.299, 0.587, 0.114));

            float bestDist = 999999.0;
            float secondDist = 999999.0;
            vec3 bestColor = palette[0];
            vec3 secondColor = palette[0];

            for (int i = 0; i < 256; i++) {
                if (float(i) >= paletteSize) break;

                vec3 pcol = pow(max(palette[i], vec3(0.0)), vec3(gammaValue));
                vec3 d = rgb - pcol;
                float dist = dot(d * d, vec3(0.30, 0.59, 0.11));

                if (dist < bestDist) {
                    secondDist = bestDist;
                    secondColor = bestColor;
                    bestDist = dist;
                    bestColor = palette[i];
                } else if (dist < secondDist) {
                    secondDist = dist;
                    secondColor = palette[i];
                }
            }

            vec3 axis = secondColor - bestColor;
            float axisLen = dot(axis, axis);
            float mixAmount = 0.0;

            if (axisLen > 0.000001) {
                mixAmount = clamp(
                    dot(source.rgb - bestColor, axis) / axisLen,
                    0.0,
                    1.0
                );
            }

            float quality = clamp(
                1.0 - max(0.0, secondDist - bestDist) * pairQuality,
                0.0,
                1.0
            );

            float shadowFactor = smoothstep(
                shadowProtection * 0.35,
                shadowProtection,
                luma
            );

            mixAmount *= ditherStrength * quality * shadowFactor;

            vec2 pixelPos = vTextureCoord * inputSize.xy;
            float threshold = matrixSize < 6.0
                ? bayer4(pixelPos)
                : bayer8(pixelPos);

            vec3 indexed = threshold < mixAmount
                ? secondColor
                : bestColor;

            gl_FragColor = vec4(indexed, source.a);
        }
    `;

    class PaletteDitherFilter extends PIXI.Filter {
        constructor() {
            super(vertexShader, fragmentShader, {
                palette: new Float32Array(768),
                paletteSize: 256.0,
                matrixSize: settings.matrixSize,
                ditherStrength: settings.ditherStrength,
                ditherScale: settings.ditherScale,
                gammaValue: settings.gamma,
                warmth: settings.warmth,
                saturation: settings.saturation,
                contrast: settings.contrast,
                shadowProtection: settings.shadowProtection,
                pairQuality: settings.pairQuality
            });

            this.setPaletteMode(settings.paletteMode);
        }

        setPaletteMode(mode) {
            settings.paletteMode = mode;
            const colors = makePalette(mode);
            const flat = new Float32Array(768);

            colors.forEach((rgb, i) => {
                flat[i * 3] = rgb[0];
                flat[i * 3 + 1] = rgb[1];
                flat[i * 3 + 2] = rgb[2];
            });

            this.uniforms.palette = flat;
        }

        setDitherScale(value) {
            settings.ditherScale = Math.max(1, Number(value) || 1);
            this.uniforms.ditherScale = settings.ditherScale;
        }

        setDitherStrength(value) {
            settings.ditherStrength = Math.max(0, Math.min(1, Number(value) || 0));
            this.uniforms.ditherStrength = settings.ditherStrength;
        }
    }

    function getFilter() {
        return SceneManager._scene?._phanicomPaletteDitherFilter || null;
    }

    function appendFilter(target, filter) {
        if (!target) return;
        const current = Array.isArray(target.filters) ? target.filters : [];
        if (!current.includes(filter)) {
            target.filters = [...current, filter];
        }
    }

    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);

        this._phanicomPaletteDitherFilter = new PaletteDitherFilter();

        if (settings.applyToUi) {
            appendFilter(this, this._phanicomPaletteDitherFilter);
        } else if (this._spriteset) {
            appendFilter(this._spriteset, this._phanicomPaletteDitherFilter);
        }
    };

    PluginManager.registerCommand(pluginName, "SetDitherScale", args => {
        getFilter()?.setDitherScale(args.scale);
    });

    PluginManager.registerCommand(pluginName, "SetDitherStrength", args => {
        getFilter()?.setDitherStrength(args.strength);
    });

    PluginManager.registerCommand(pluginName, "SetPaletteMode", args => {
        getFilter()?.setPaletteMode(String(args.mode || "FalloutWarm"));
    });
})();
