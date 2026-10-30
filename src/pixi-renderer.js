/* MAINTAINER GUIDE
 * Pooled Pixi graphics, sprites and text behind a Canvas-like drawing interface. Simulation remains renderer-independent. Pools and texture caches avoid creating GPU objects each frame; begin resets state, end submits one frame.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier pixi. */
(/* @function pixiRenderer.reviewed1 — Installs pooled Pixi drawing services. Inputs: browser root with loaded PIXI. Returns nothing; registers FrontierPixi API and shared tone state. Context/application initialization is deferred until first context request; simulation remains renderer-independent. */ function (
  root,
) {
  "use strict";
  const P = root.PIXI;
  let app = null,
    adapter = null,
    started = false,
    failed = false;
  const screenTone = new Float32Array(4);
  // Convert CSS color into Pixi numeric color plus alpha; multiply with drawing-context opacity.
  const colors = new Map();
  // Bound the palette cache: dynamic mod colors cannot grow it indefinitely.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.color.2 — Bound the palette cache: dynamic mod colors cannot grow it indefinitely. Inputs: value. Uses: colors has; colors get; c to number; colors delete. Returns: colors get using value; parsed. */
  /* @function pixiRenderer.reviewed2 — Converts CSS/Pixi color to numeric RGB and alpha. Inputs: supported color value. Returns cached parsed record; keeps at most 128 entries by evicting the oldest. Invalid values propagate Pixi errors. No source texture or world mutation. */ function color(
    value,
  ) {
    if (colors.has(value)) return colors.get(value);
    const c = new P.Color(value);
    const parsed = { color: c.toNumber(), alpha: c.alpha };
    if (colors.size >= 128) colors.delete(colors.keys().next().value);
    colors.set(value, parsed);
    return parsed;
  }
  class DrawContext {
    // Own application resources and reusable object/texture pools for the adapter lifetime.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.constructor.3 — function Object() { [native code] } Inputs: application. Updates: this app; this graphics; this sprites; this texts; this sources. Uses: this beam layer add child. */
    /* @function pixiRenderer.reviewed3 — Constructs one drawing adapter. Inputs: initialized Pixi Application. Returns the new DrawContext instance owning pooled graphics/sprites/text/meshes and shared glow resources. Allocates initial beam/filter/container; textures are cached lazily. Pixi allocation errors propagate. */ constructor(
      application,
    ) {
      this.app = application;
      this.graphics = [];
      this.sprites = [];
      this.verticalMeshes = [];
      this.verticalMasks = [];
      this.verticalGlow = [];
      this.verticalTextures = new WeakMap();
      this.texts = [];
      this.sources = new WeakMap();
      this.normalFilters = new WeakMap();
      this.crops = new WeakMap();
      // One reusable glow surface and blur filter, shared by every world vector.
      this.graphicMasks = [];
      this.imageMasks = [];
      this.beamSprites = [];
      this.beamLayer = new P.Container();
      this.bi = 0;
      this.waterMeshes = [];
      this.waterTextures = new WeakMap();
      this.waterPattern = null;
      this.beam = new P.Graphics();
      this.beamFilter = new P.BlurFilter({
        strength: 5,
        quality: 2,
        resolution: 0.5,
      });
      this.beamLayer.addChild(this.beam);
      this.beamLayer.filters = [this.beamFilter];
      this.fogFilters = [];
      this.fogPalette = new Map();
      this.fogColor = "";
    }
    // Reset per-frame state and reuse pooled display objects; removing children does not destroy cached GPU resources.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.begin.4 — Handles begin within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this gi; this si; this ti; this graphic; this pending stroke. Uses: this app stage remove children; this beam layer remove children; this beam layer add child; this beam clear. */
    /* @function pixiRenderer.reviewed4 — Begins a logical frame. Inputs: none. Returns nothing; clears stage membership and beam commands, resets draw indices/styles/transforms/clips and transient stacks. Reuses GPU resource pools rather than destroying them. Must run before drawing; does not advance simulation. */ begin() {
      this.app.stage.removeChildren();
      this.gi = this.si = this.ti = this.vi = 0;
      this.graphic = null;
      this.pendingStroke = null;
      this.assetNormal = null;
      this.assetLight = null;
      this.wi = this.bi = 0;
      this.imageClip = null;
      this.graphicClip = null;
      this.clipBottom = null;
      this.assetGlow = false;
      this.beamLayer.removeChildren();
      this.beamLayer.addChild(this.beam);
      this.beam.clear();
      this.beamAdded = false;
      this.vectorDisplay = null;
      this.stack = [];
      this.matrix = [1, 0, 0, 1, 0, 0];
      this.globalAlpha = 1;
      this.fillStyle = "#fff";
      this.strokeStyle = "#fff";
      this.lineWidth = 1;
      this.font = "12px PhanicomCheckbook";
      this.textAlign = "left";
      this.fog = null;
      this.fogDepth = 0;
    }
    // Transform a local point through the current affine matrix.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.point.5 — Handles point within pixi renderer. Inputs: x; y. Returns: a list of m at 0 multiplied by x plus m at 2 multiplied by y plus m at 4, m at 1 multiplied by x plus m at 3 multiplied by y plus m at 5. */
    /* @function pixiRenderer.reviewed5 — Maps a local drawing point to logical screen space. Inputs: x/y in logical pixels. Returns transformed XY pair using the current 2D affine matrix. No validation or source mutation; callers supply finite values, independent of framebuffer density. */ point(
      x,
      y,
    ) {
      const m = this.matrix;
      return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
    }
    // Reuse the next Graphics object; start a new draw group after a sprite or text to preserve painter order.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.gfx.6 — Handles gfx within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphics at this gi; g mask; this graphic masks at this gi minus 1; this graphic. Uses: g clear; mask clear; mask rect; mask fill. Returns: this graphic. */
    /* @function pixiRenderer.reviewed6 — Obtains the current pooled vector group. Inputs: none. Returns reused/new Pixi Graphics, cleared for this frame and appended in painter order. Installs optional logical-pixel clip mask at group boundaries. Resources grow only to drawing high-water needs; Pixi errors propagate. */ gfx() {
      if (!this.graphic) {
        const g =
          this.graphics[this.gi] || (this.graphics[this.gi] = new P.Graphics());
        this.gi++;
        g.clear();
        g.mask = null;
        if (this.graphicClip || this.clipBottom !== null) {
          const mask =
            this.graphicMasks[this.gi - 1] ||
            (this.graphicMasks[this.gi - 1] = new P.Graphics());
          mask.clear();
          if (this.graphicClip) {
            for (const r of this.graphicClip.regions || [this.graphicClip])
              mask.rect(r.x, r.y, r.width, r.height);
          } else
            mask.rect(
              0,
              0,
              this.app.screen.width,
              Math.max(0, this.clipBottom),
            );
          mask.fill(0xffffff);
          this.app.stage.addChild(mask);
          g.mask = mask;
        }
        this.app.stage.addChild(g);
        this.graphic = g;
      }
      return this.graphic;
    }
    // Push independent drawing state so nested transforms/styles cannot leak to later objects.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.save.7 — Handles save within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this stack push. */
    /* @function pixiRenderer.reviewed7 — Pushes drawing state for nested rendering. Inputs: none. Returns nothing; copies current affine matrix and saves style/opacity/fog/clip fields. Does not clone textures or world records. Callers must balance save/restore. */ save() {
      this.stack.push({
        matrix: [...this.matrix],
        globalAlpha: this.globalAlpha,
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
        font: this.font,
        textAlign: this.textAlign,
        fogDepth: this.fogDepth,
        graphicClip: this.graphicClip,
        clipBottom: this.clipBottom,
      });
    }
    // Restore the most recent drawing state; callers must balance save/restore.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.restore.8 — Applies saved state to this system. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphic. Uses: this stack pop; this flush stroke; object assign. */
    /* @function pixiRenderer.reviewed8 — Restores the last drawing state. Inputs: none. Returns nothing; pops and assigns saved fields, flushing strokes if clip state changes. Unbalanced restore throws because no state exists; does not silently invent defaults or alter simulation. */ restore() {
      const state = this.stack.pop();
      if (
        state.clipBottom !== this.clipBottom ||
        state.graphicClip !== this.graphicClip
      ) {
        this.flushStroke();
        this.graphic = null;
      }
      Object.assign(this, state);
    }
    // Compose local translation into the current affine transform.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.translate.9 — Handles translate within pixi renderer. Inputs: x; y. Updates: this matrix at 4; this matrix at 5. Uses: this point. */
    /* @function pixiRenderer.reviewed9 — Composes translation into the drawing matrix. Inputs: x/y local logical-pixel offsets. Returns nothing; transforms the offset through current basis and writes translation. Does not move world entities or change framebuffer scale. */ translate(
      x,
      y,
    ) {
      const q = this.point(x, y);
      this.matrix[4] = q[0];
      this.matrix[5] = q[1];
    }
    // Scale matrix basis vectors without changing translation.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.scale.10 — Handles scale within pixi renderer. Inputs: x; y. Updates: this matrix at 0; this matrix at 1; this matrix at 2; this matrix at 3. */
    /* @function pixiRenderer.reviewed10 — Scales the drawing basis. Inputs: finite x/y dimensionless multipliers. Returns nothing; changes matrix basis components while leaving translation. No source image resize or world geometry mutation. */ scale(
      x,
      y,
    ) {
      this.matrix[0] *= x;
      this.matrix[1] *= x;
      this.matrix[2] *= y;
      this.matrix[3] *= y;
    }
    // Rotate matrix basis vectors while retaining accumulated scale/translation.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.rotate.11 — Handles rotate within pixi renderer. Inputs: angle. Uses: object assign. */
    /* @function pixiRenderer.reviewed11 — Rotates the drawing basis. Inputs: angle in radians. Returns nothing; composes 2D rotation into scale/basis, retaining translation. Does not use editor degrees or modify source sprite frame geometry. */ rotate(
      angle,
    ) {
      const [a, b, c, d] = this.matrix,
        cs = Math.cos(angle),
        sn = Math.sin(angle);
      Object.assign(this.matrix, {
        0: a * cs + c * sn,
        1: b * cs + d * sn,
        2: c * cs - a * sn,
        3: d * cs - b * sn,
      });
    }
    // Start a fresh transformed path command buffer.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.beginPath.12 — Handles begin path within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this path. */
    /* @function pixiRenderer.reviewed12 — Starts a new vector path buffer. Inputs: none. Returns nothing; replaces only current path commands. Does not clear the frame stage or submit GPU work. */ beginPath() {
      this.path = [];
    }
    // Append a transformed path start.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.moveTo.13 — Handles move to within pixi renderer. Inputs: x; y. Uses: this path push; this point. */
    /* @function pixiRenderer.reviewed13 — Starts a path contour at a transformed point. Inputs: x/y local logical pixels. Returns nothing; appends moveTo with current affine mapping. Requires begun path; no world mutation. */ moveTo(
      x,
      y,
    ) {
      this.path.push(["moveTo", ...this.point(x, y)]);
    }
    // Append a transformed line endpoint.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.lineTo.14 — Handles line to within pixi renderer. Inputs: x; y. Uses: this path push; this point. */
    /* @function pixiRenderer.reviewed14 — Appends a transformed line endpoint. Inputs: x/y local logical pixels. Returns nothing; adds lineTo to current path, with no immediate GPU submission. Requires begun path and finite coordinates. */ lineTo(
      x,
      y,
    ) {
      this.path.push(["lineTo", ...this.point(x, y)]);
    }
    // Transform both control points and endpoint for curved vector paths.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.bezierCurveTo.15 — Handles bezier curve to within pixi renderer. Inputs: a; b; c; d; x; y. Uses: this path push; this point. */
    /* @function pixiRenderer.reviewed15 — Appends a transformed cubic curve. Inputs: two control-point XY pairs a/b,c/d and endpoint x/y in logical pixels. Returns nothing; maps all points through current affine matrix and queues the path command. No source geometry mutation. */ bezierCurveTo(
      a,
      b,
      c,
      d,
      x,
      y,
    ) {
      this.path.push([
        "bezierCurveTo",
        ...this.point(a, b),
        ...this.point(c, d),
        ...this.point(x, y),
      ]);
    }
    // Close the buffered vector contour.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.closePath.16 — Handles close path within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this path push. */
    /* @function pixiRenderer.reviewed16 — Closes the buffered contour. Inputs: none. Returns nothing; appends closePath without submitting rendering. Requires a begun path, preserving caller painter order. */ closePath() {
      this.path.push(["closePath"]);
    }
    // Replay path commands into pooled Pixi Graphics and apply color/opacity/width.
    // Flush only at a style/order boundary. Separate moveTo contours preserve
    // the original paths while avoiding repeated Pixi style normalization.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.flushStroke.17 — Handles flush stroke within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this pending stroke. Uses: this graphic stroke. Returns: without a result. */
    /* @function pixiRenderer.reviewed17 — Submits the pending vector stroke style to its current graphics group. Inputs: none. Returns nothing; no-ops if no pending style, otherwise strokes and clears it. Runs at order/style boundaries, avoiding repeated style normalization. Pixi errors propagate. */ flushStroke() {
      if (!this.pendingStroke) return;
      this.graphic.stroke(this.pendingStroke);
      this.pendingStroke = null;
    }
    // Palette blends vector/text colors. Sprite filters preserve texture alpha
    // while blending RGB toward fog; at most sixteen cached filters are reused.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.fogAmount.18 — Handles fog amount within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: root frontier fog amount. Returns: chain or 0. */
    /* @function pixiRenderer.reviewed18 — Reads current fog blend amount. Inputs: none. Returns normalized fog influence for captured world fog and forward depth, or zero if unavailable. Read-only; fog depth uses the renderer world-distance convention. */ fogAmount() {
      return (
        root.FrontierFog?.amount(
          this.fog || root.FrontierFog.defaults,
          this.fogDepth,
        ) || 0
      );
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.fogRGB.19 — Handles fog rgb within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: color. Returns: color using this fog color color. */
    /* @function pixiRenderer.reviewed19 — Reads numeric current fog RGB. Inputs: none. Returns parsed numeric color through the bounded palette cache. Requires valid current fog settings; invalid color propagates. No world mutation. */ fogRGB() {
      return color(this.fog.color).color;
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.painted.20 — Handles painted within pixi renderer. Inputs: value. Updates: rgb. Uses: color; this fog amount; this fog palette has; this fog palette get. Returns: original; this fog palette get using key. */
    /* @function pixiRenderer.reviewed20 — Blends vector/text color toward current fog. Inputs: supported color value. Returns RGB/alpha record preserving original alpha. Reuses a palette bounded to 512 blend keys; clears that cache at capacity. Does not change authored fog or source color. */ painted(
      value,
    ) {
      const original = color(value),
        a = this.fogAmount();
      if (!a) return original;
      const key = value + "|" + this.fog.color + "|" + a;
      if (this.fogPalette.has(key)) return this.fogPalette.get(key);
      const target = this.fogRGB(),
        source = original.color;
      let rgb = 0;
      for (const shift of [16, 8, 0])
        rgb |=
          Math.round(
            ((source >> shift) & 255) * (1 - a) + ((target >> shift) & 255) * a,
          ) << shift;
      const result = { color: rgb, alpha: original.alpha };
      if (this.fogPalette.size >= 512) this.fogPalette.clear();
      this.fogPalette.set(key, result);
      return result;
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.spriteFog.21 — Handles sprite fog within pixi renderer. Inputs: a. Updates: this fog color; f matrix; this fog filters at index. Uses: this fog rgb. Returns: null; this fog filters at index. */
    /* @function pixiRenderer.reviewed21 — Obtains a pooled sprite fog filter. Inputs: normalized blend a (0..1). Returns null for zero or cached one-filter array at rounded sixteenth level. Recolors existing filters when fog color changes, preserving texture alpha. Requires current valid fog; Pixi errors propagate. */ spriteFog(
      a,
    ) {
      if (!a) return null;
      if (this.fogColor !== this.fog.color) {
        this.fogColor = this.fog.color;
        // Recolor existing GPU filters instead of rebuilding them when a future
        // day/night system interpolates fog color every frame.
        const rgb = this.fogRGB();
        for (let i = 1; i < this.fogFilters.length; i++) {
          const f = this.fogFilters[i]?.[0];
          if (!f) continue;
          const t = i / 16,
            k = 1 - t;
          f.matrix = [
            k,
            0,
            0,
            0,
            (((rgb >> 16) & 255) / 255) * t,
            0,
            k,
            0,
            0,
            (((rgb >> 8) & 255) / 255) * t,
            0,
            0,
            k,
            0,
            ((rgb & 255) / 255) * t,
            0,
            0,
            0,
            1,
            0,
          ];
        }
      }
      const index = Math.round(a * 16);
      if (this.fogFilters[index]) return this.fogFilters[index];
      const f = new P.ColorMatrixFilter(),
        rgb = this.fogRGB(),
        k = 1 - a;
      f.matrix = [
        k,
        0,
        0,
        0,
        (((rgb >> 16) & 255) / 255) * a,
        0,
        k,
        0,
        0,
        (((rgb >> 8) & 255) / 255) * a,
        0,
        0,
        k,
        0,
        ((rgb & 255) / 255) * a,
        0,
        0,
        0,
        1,
        0,
      ];
      return (this.fogFilters[index] = [f]);
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.stroke.22 — Handles stroke within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphic; this beam added; this beam filter strength; this beam layer alpha; this pending stroke. Uses: this flush stroke; this app stage add child; this painted; root frontier vector paths. */
    /* @function pixiRenderer.reviewed22 — Queues the current vector path stroke. Inputs: none. Returns nothing; uses current styles, affine width and optional vector monochrome/glow settings. Flushes on style/order boundaries, inserts pooled beam halo behind sprite cores and clamps active vector line width. Does not alter authored paths or simulate lights. */ stroke() {
      const v = this.vectorDisplay,
        active = v?.enabled;
      // Add the halo after the background and before all scene sprites/cores.
      if (active && !this.beamAdded) {
        this.flushStroke();
        this.graphic = null;
        this.app.stage.addChild(this.beamLayer);
        this.beamAdded = true;
        this.beamFilter.strength = v.radius;
        this.beamLayer.alpha = v.glow;
      }
      const c = this.painted(
          active && v.monochrome ? v.color : this.strokeStyle,
        ),
        alpha = c.alpha * this.globalAlpha;
      const path =
        root.FrontierVector?.paths(this.path, v || { enabled: false }) ||
        this.path;
      const authoredWidth =
        this.lineWidth *
        Math.sqrt(
          Math.abs(
            this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2],
          ),
        );
      const width = active
        ? Math.min(1.5, Math.max(0.7, authoredWidth))
        : authoredWidth;
      const previous = this.pendingStroke;
      if (
        previous &&
        (previous.color !== c.color ||
          previous.alpha !== alpha ||
          previous.width !== width)
      )
        this.flushStroke();
      const g = this.gfx();
      for (const [method, ...args] of path) g[method](...args);
      if (active && v.glow) {
        for (const [method, ...args] of path) this.beam[method](...args);
        this.beam.stroke({
          color: c.color,
          alpha,
          width: Math.max(1, width) + 2,
        });
      }
      if (!this.pendingStroke)
        this.pendingStroke = { color: c.color, alpha, width };
    }
    // Pooled water tiles share one source texture. UV motion gives inexpensive
    // Quake-style distortion; geometry remains a flat plane. Meshes batch in Pixi.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.waterQuad.23 — Handles water quad within pixi renderer. Inputs: points; material; x; y; assignment pattern. Updates: this graphic; c width; c height; pixels data at o; pixels data at o plus 1. Uses: this flush stroke; document create element; c get context; q create image data. */
    /* @function pixiRenderer.reviewed23 — Draws one projected water triangle/quad. Inputs: projected logical-pixel points, validated animated material, world x/y and optional world UV coordinates. Returns nothing; reuses texture/mesh pools and updates flow/warp UVs using material time in seconds. Creates a small fallback pattern once. Flat source geometry and CPU depth remain owned by callers; invalid data/Pixi errors propagate. */ waterQuad(
      points,
      material,
      x,
      y,
      coords = [
        [x, y],
        [x + 1, y],
        [x + 1, y + 1],
        [x, y + 1],
      ],
    ) {
      this.flushStroke();
      this.graphic = null;
      if (!this.waterPattern) {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const q = c.getContext("2d"),
          pixels = q.createImageData(64, 64);
        for (let j = 0; j < 64; j++)
          for (let i = 0; i < 64; i++) {
            const n =
                0.5 +
                0.25 * Math.sin(i * 0.196 + j * 0.098) +
                0.2 * Math.cos(j * 0.294 - i * 0.098),
              o = (j * 64 + i) * 4;
            pixels.data[o] = Math.round(110 + n * 100);
            pixels.data[o + 1] = Math.round(110 + n * 100);
            pixels.data[o + 2] = Math.round(110 + n * 100);
            pixels.data[o + 3] = 255;
          }
        q.putImageData(pixels, 0, 0);
        this.waterPattern = c;
      }
      const original = material.textureImage || this.waterPattern;
      const image =
        root.FrontierAssetStyle?.image(
          original,
          this.world.vectorDisplay,
          this.world.vectorDisplay?.textures,
        ) || original;
      let texture = this.waterTextures.get(image);
      if (!texture) {
        texture = new P.Texture({
          source: new P.ImageSource({
            resource: image,
            addressMode: "repeat",
            scaleMode:
              root.FrontierDisplay?.get().filtering === "smooth"
                ? "linear"
                : "nearest",
          }),
        });
        this.waterTextures.set(image, texture);
      }
      texture.source.scaleMode =
        root.FrontierDisplay?.get().filtering === "smooth"
          ? "linear"
          : "nearest";
      let mesh = this.waterMeshes[this.wi];
      if (!mesh) {
        mesh = new P.Mesh({
          geometry: new P.MeshGeometry({
            positions: new Float32Array(8),
            uvs: new Float32Array(8),
            indices: new Uint16Array([0, 1, 2]),
          }),
          texture,
        });
        this.waterMeshes[this.wi] = mesh;
      }
      this.wi++;
      mesh.texture = texture;
      mesh.tint = this.painted(material.color).color;
      const positions = mesh.geometry.getBuffer("aPosition"),
        uvs = mesh.geometry.getBuffer("aUV");
      mesh.waterTriangleIndices ||= new Uint16Array([0, 1, 2]);
      mesh.waterQuadIndices ||= new Uint16Array([0, 1, 2, 0, 2, 3]);
      const indices =
        points.length === 4 ? mesh.waterQuadIndices : mesh.waterTriangleIndices;
      if (mesh.geometry.indexBuffer.data !== indices) {
        mesh.geometry.indexBuffer.data = indices;
        mesh.geometry.indexBuffer.update();
      }
      for (let i = 0; i < points.length; i++) {
        positions.data[i * 2] = points[i].x;
        positions.data[i * 2 + 1] = points[i].y;
        const [u, v] = coords[i],
          t = material.time * material.speed;
        uvs.data[i * 2] =
          u / material.scale +
          Math.sin(v * 1.7 + t) * material.warp +
          material.time * material.flowX;
        uvs.data[i * 2 + 1] =
          v / material.scale +
          Math.sin(u * 1.3 + t) * material.warp +
          material.time * material.flowY;
      }
      positions.update();
      uvs.update();
      mesh.alpha = 1;
      this.app.stage.addChild(mesh);
    }
    /* @function pixi-renderer.terrainBatch1523 — Inputs: sorted terrain triangle records and shared static material. Draws the same projected positions, affine UVs and painter order through one reusable mesh. Preserves filtering and asset-style texture choice; does not alter CPU depth. Grows buffers only when necessary, submits only active indices, and returns without work for empty input. Static terrain only: callers keep animated water on waterQuad. */
    // October 13: optional radius lighting shares this geometry and preserves
    // affine UVs; the extra world/depth attribute is owned by the same batch.
    /* @function pixiRenderer.litTerrainBatch1524 — Inputs: sorted near-clipped cells with world XYZ and a static material. Returns nothing; submits the existing reusable mesh or a shared-geometry radius-lighting mesh. Preserves affine UVs and CPU depth. Lighting resources retire with batch capacity growth; source textures remain owned by the shared material cache. */
    terrainBatch1523(cells, material) {
      if (!cells.length) return;
      this.flushStroke();
      this.graphic = null;
      const original = material.textureImage,
        image =
          root.FrontierAssetStyle?.image(
            original,
            this.world.vectorDisplay,
            this.world.vectorDisplay?.textures,
          ) || original;
      let texture = this.waterTextures.get(image);
      if (!texture) {
        texture = new P.Texture({
          source: new P.ImageSource({
            resource: image,
            addressMode: "repeat",
            scaleMode: root.FrontierDisplay?.smooth() ? "linear" : "nearest",
          }),
        });
        this.waterTextures.set(image, texture);
      }
      texture.source.scaleMode = root.FrontierDisplay?.smooth()
        ? "linear"
        : "nearest";
      const count = cells.length * 3;
      let batch = this.terrainBatchState;
      if (!batch || batch.capacity < count) {
        const capacity = 2 ** Math.ceil(Math.log2(Math.max(3, count))),
          positions = new Float32Array(capacity * 2),
          uvs = new Float32Array(capacity * 2),
          indices = new Uint32Array(capacity);
        for (let i = 0; i < capacity; i++) indices[i] = i;
        const geometry = new P.MeshGeometry({ positions, uvs, indices });
        /* October 12, 2026: Pixi Mesh.destroy does not own Geometry destruction. Explicitly retire our exclusive geometry and its buffers when capacity grows; keep the shared material texture alive. */ if (
          batch
        ) {
          root.FrontierTerrainLighting?.retire(batch);
          const retiredGeometry = batch.mesh.geometry;
          batch.mesh.destroy();
          retiredGeometry.destroy(true);
        }
        batch = {
          capacity,
          positions,
          uvs,
          indices,
          mesh: new P.Mesh({ geometry, texture }),
        };
        this.terrainBatchState = batch;
      }
      let index = 0;
      for (const cell of cells)
        for (let i = 0; i < 3; i++) {
          batch.positions[index * 2] = cell.p[i].x;
          batch.positions[index * 2 + 1] = cell.p[i].y;
          batch.uvs[index * 2] = cell.coords[i][0] / material.scale;
          batch.uvs[index * 2 + 1] = cell.coords[i][1] / material.scale;
          index++;
        }
      const geometry = batch.mesh.geometry,
        positions = geometry.getBuffer("aPosition"),
        uvs = geometry.getBuffer("aUV");
      positions.data = batch.positions.subarray(0, count * 2);
      uvs.data = batch.uvs.subarray(0, count * 2);
      geometry.indexBuffer.data = batch.indices.subarray(0, count);
      positions.update();
      uvs.update();
      geometry.indexBuffer.update();
      batch.mesh.texture = texture;
      batch.mesh.tint = this.painted(material.color).color;
      batch.mesh.alpha = 1;
      const mesh = this.localLightFrame
        ? root.FrontierTerrainLighting.prepare(
            P,
            batch,
            texture,
            cells,
            this.localLightFrame,
            this.game.viewWidth || 640,
            batch.mesh.tint,
            this.fog,
          )
        : batch.mesh;
      this.app.stage.addChild(mesh);
    }
    // Fill arbitrary primitive faces through the pooled graphics path.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.fill.24 — Handles fill within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this flush stroke; this gfx; g at method; this painted. */
    /* @function pixiRenderer.reviewed24 — Fills the current transformed vector path. Inputs: none. Returns nothing; flushes pending stroke and submits pooled Graphics fill using fogged color/current alpha. Requires begun path; no simulation or texture mutation. */ fill() {
      this.flushStroke();
      const g = this.gfx();
      for (const [method, ...args] of this.path) g[method](...args);
      const c = this.painted(this.fillStyle);
      g.fill({ color: c.color, alpha: c.alpha * this.globalAlpha });
    }
    // Build a transformed rectangle path reusable by fill and stroke.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.rectPath.25 — Handles rect path within pixi renderer. Inputs: x; y; w; h. Uses: this begin path; this move to; this line to; this close path. */
    /* @function pixiRenderer.reviewed25 — Builds a closed rectangle path. Inputs: x/y origin and w/h local logical-pixel dimensions. Returns nothing; replaces current path with transformed corners. Does not fill/stroke or resize world geometry. */ rectPath(
      x,
      y,
      w,
      h,
    ) {
      this.beginPath();
      this.moveTo(x, y);
      this.lineTo(x + w, y);
      this.lineTo(x + w, y + h);
      this.lineTo(x, y + h);
      this.closePath();
    }
    // Construct and stroke a rectangle with the current style.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.strokeRect.26 — Handles stroke rect within pixi renderer. Inputs: x; y; w; h. Uses: this rect path; this stroke. */
    /* @function pixiRenderer.reviewed26 — Strokes a transformed rectangle. Inputs: x/y/w/h in local logical pixels. Returns nothing; builds its path and uses current stroke/vector style. Rendering side effects only; caller supplies finite dimensions. */ strokeRect(
      x,
      y,
      w,
      h,
    ) {
      this.rectPath(x, y, w, h);
      this.stroke();
    }
    // Fill a transformed rectangle using current color and opacity.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.fillRect.27 — Handles fill rect within pixi renderer. Inputs: x; y; w; h. Uses: this flush stroke; this rect path; this gfx; g at method. */
    /* @function pixiRenderer.reviewed27 — Fills a transformed rectangle. Inputs: x/y/w/h local logical pixels. Returns nothing; flushes stroke order, builds path and submits fogged color/current opacity. No simulation or source texture resize. */ fillRect(
      x,
      y,
      w,
      h,
    ) {
      this.flushStroke();
      this.rectPath(x, y, w, h);
      const g = this.gfx();
      for (const [method, ...args] of this.path) g[method](...args);
      const c = this.painted(this.fillStyle);
      g.fill({
        color: c.color,
        alpha: c.alpha * this.globalAlpha,
      });
    }
    // Cache image sources and crop textures; reuse a sprite and apply its affine transform/opacity.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.setGraphicClip.28 — Handles set graphic clip within pixi renderer. Inputs: rect. Updates: this graphic; this graphic clip. Uses: this flush stroke. */
    /* @function pixiRenderer.reviewed28 — Changes vector clipping for subsequent groups. Inputs: logical-pixel rectangle/region record or null. Returns nothing; flushes current stroke, starts a fresh graphic group and retains clip reference. Does not modify clip data or retroactively remask prior draws. */ setGraphicClip(
      rect,
    ) {
      this.flushStroke();
      this.graphic = null;
      this.graphicClip = rect;
    }
    // October 9, 2026: eight perspective bands share one mesh/texture/mask.
    /* @function pixi-renderer.drawSpriteBands — Inputs: loaded atlas image or cached lighting/style canvas, frame pixel rectangle, up to eight projected bands, optional depth-mask regions. Returns nothing. Reuses GPU geometry and masks at visible-entity high-water mark; no per-frame texture creation. Bands are world-upright and use the same depth plane as the mask. Canvas fallback remains in render.candy. */
    // October 14: retained historical utility; normal locked 0.15.17 sprites
    // use drawImage. Do not substitute this upright-band helper for that path.
    /* @function pixiRenderer.historicalBands — Inputs: atlas image, source frame pixels, up to eight projected band records and optional logical-pixel depth-mask regions. Returns nothing; reuses historical mesh/texture/mask pools. No current normal-sprite caller uses this helper, and it must not replace the locked camera-facing presentation. Requires valid loaded image and band data; Pixi failures propagate. */
    drawSpriteBands(image, frame, bands, regions) {
      this.flushStroke();
      this.graphic = null;
      let texture = this.verticalTextures.get(image);
      if (!texture) {
        texture = new P.Texture({
          source: new P.ImageSource({
            resource: image,
            scaleMode:
              root.FrontierDisplay?.get().filtering === "smooth"
                ? "linear"
                : "nearest",
          }),
        });
        this.verticalTextures.set(image, texture);
      }
      texture.source.scaleMode =
        root.FrontierDisplay?.get().filtering === "smooth"
          ? "linear"
          : "nearest";
      let mesh = this.verticalMeshes[this.vi];
      if (!mesh) {
        const indices = new Uint16Array(48);
        for (let i = 0; i < 8; i++) {
          const v = i * 4,
            o = i * 6;
          indices.set([v, v + 1, v + 2, v, v + 2, v + 3], o);
        }
        mesh = new P.Mesh({
          geometry: new P.MeshGeometry({
            positions: new Float32Array(64),
            uvs: new Float32Array(64),
            indices,
          }),
          texture,
        });
        this.verticalMeshes[this.vi] = mesh;
      }
      const index = this.vi++;
      mesh.texture = texture;
      mesh.alpha = this.globalAlpha;
      mesh.filters = this.spriteFog(this.fogAmount());
      mesh.mask = null;
      const positions = mesh.geometry.getBuffer("aPosition"),
        uvs = mesh.geometry.getBuffer("aUV");
      positions.data.fill(0);
      uvs.data.fill(0);
      for (let i = 0; i < bands.length; i++) {
        const b = bands[i],
          uv = [
            [frame.x, frame.y + b.sourceY],
            [frame.x + frame.w, frame.y + b.sourceY],
            [frame.x + frame.w, frame.y + b.endY],
            [frame.x, frame.y + b.endY],
          ];
        for (let j = 0; j < 4; j++) {
          const q = this.point(b.points[j][0], b.points[j][1]),
            o = i * 8 + j * 2;
          positions.data[o] = q[0];
          positions.data[o + 1] = q[1];
          uvs.data[o] = uv[j][0] / (image.naturalWidth || image.width);
          uvs.data[o + 1] = uv[j][1] / (image.naturalHeight || image.height);
        }
      }
      positions.update();
      uvs.update();
      if (regions) {
        const mask =
          this.verticalMasks[index] ||
          (this.verticalMasks[index] = new P.Graphics());
        mask.clear();
        for (const r of regions) mask.rect(r.x, r.y, r.width, r.height);
        mask.fill(0xffffff);
        this.app.stage.addChild(mask);
        mesh.mask = mask;
      }
      this.app.stage.addChild(mesh);
      if (
        this.vectorDisplay?.enabled &&
        (this.vectorDisplay.sprites !== "original" || this.assetGlow) &&
        this.beamAdded
      ) {
        let glow = this.verticalGlow[index];
        if (!glow) {
          glow = new P.Mesh({ geometry: mesh.geometry, texture });
          this.verticalGlow[index] = glow;
        }
        glow.texture = texture;
        glow.alpha = this.globalAlpha;
        glow.mask = mesh.mask;
        this.beamLayer.addChild(glow);
      }
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.setImageClip.29 — Handles set image clip within pixi renderer. Inputs: rect. Updates: this image clip. */
    /* @function pixiRenderer.reviewed29 — Sets subsequent image clipping. Inputs: logical-pixel rectangle/regions or null. Returns nothing; retains clip reference for future pooled image masks. No immediate draw or source/sprite-presentation change. */ setImageClip(
      rect,
    ) {
      this.imageClip = rect;
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.drawImage.30 — Handles draw image within pixi renderer. Inputs: image; sx; sy; sw; sh; dx; dy; dw; dh. Updates: source; texture; this sprites at this si; sprite texture; sprite alpha. Uses: this flush stroke; this sources get; this sources set; this crops set. */
    /* @function pixiRenderer.reviewed30 — Draws a cropped image through the current affine transform. Inputs: loaded image, source sx/sy/sw/sh pixels and destination dx/dy/dw/dh logical pixels. Returns nothing; caches sources/crops, reuses sprite pool and applies alpha, local illumination, fog, color pools, optional normal filter and clip/glow. Source pixels/frame dimensions remain unchanged; caller supplies nonzero valid crops, and Pixi failures propagate. */ drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      dx,
      dy,
      dw,
      dh,
    ) {
      this.flushStroke();
      let source = this.sources.get(image);
      if (!source) {
        source = new P.ImageSource({
          resource: image,
          scaleMode:
            root.FrontierDisplay?.get().filtering === "smooth"
              ? "linear"
              : "nearest",
        });
        this.sources.set(image, source);
        this.crops.set(image, new Map());
      }
      const key = [sx, sy, sw, sh].join(","),
        cache = this.crops.get(image);
      let texture = cache.get(key);
      if (!texture) {
        texture = new P.Texture({
          source,
          frame: new P.Rectangle(sx, sy, sw, sh),
        });
        cache.set(key, texture);
      }
      const sprite =
        this.sprites[this.si] ||
        (this.sprites[this.si] = new P.Sprite(texture));
      this.si++;
      sprite.texture = texture;
      sprite.alpha = this.globalAlpha;
      // October 12, 2026: local illumination multiplies the world sprite only; normal/color filters and alpha remain independent.
      const light = this.assetLightTint;
      sprite.tint = light
        ? (Math.round(light[0] * 255) << 16) |
          (Math.round(light[1] * 255) << 8) |
          Math.round(light[2] * 255)
        : 0xffffff;
      sprite.filters = this.spriteFog(this.fogAmount());
      const poolFilter = root.FrontierColorPools?.filter(
        P,
        sprite,
        this.assetPools,
        this.effectTime || 0,
      );
      if (poolFilter) sprite.filters = [...(sprite.filters || []), poolFilter];
      sprite.texture.source.scaleMode =
        root.FrontierDisplay?.get().filtering === "smooth"
          ? "linear"
          : "nearest";
      const normal = this.assetNormal,
        l = this.assetLight;
      if (normal?.complete && normal.naturalWidth && l) {
        let filter = this.normalFilters.get(normal);
        if (!filter) {
          const normalSource = new P.ImageSource({
            resource: normal,
            scaleMode: "linear",
          });
          filter = new P.Filter({
            glProgram: P.GlProgram.from({
              vertex: P.defaultFilterVert,
              fragment:
                "precision highp float;in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform sampler2D uNormal;uniform vec4 uInputSize;uniform vec4 uOutputFrame;uniform vec3 uLight;uniform float uAmbient;uniform float uPower;void main(){vec4 c=texture(uTexture,vTextureCoord);vec2 uv=clamp(vTextureCoord*uInputSize.xy/uOutputFrame.zw,vec2(0.0),vec2(1.0));vec3 n=normalize(texture(uNormal,uv).rgb*2.0-1.0);float shade=uAmbient+uPower*max(0.0,dot(n,normalize(uLight)));finalColor=vec4(c.rgb*shade,c.a);}",
            }),
            resources: {
              uNormal: normalSource,
              normalUniforms: {
                uLight: {
                  value: new Float32Array([l.x, l.y, l.z]),
                  type: "vec3<f32>",
                },
                uAmbient: { value: l.ambient, type: "f32" },
                uPower: { value: l.strength, type: "f32" },
              },
            },
          });
          filter.padding = 0;
          this.normalFilters.set(normal, filter);
        }
        const u = filter.resources.normalUniforms.uniforms;
        u.uLight[0] = l.x;
        u.uLight[1] = l.y;
        u.uLight[2] = l.z;
        u.uAmbient = l.ambient;
        u.uPower = l.strength;
        sprite.filters = [...(sprite.filters || []), filter];
      }
      const m = this.matrix,
        q = this.point(dx, dy);
      const imageMatrix = new P.Matrix(
        (m[0] * dw) / sw,
        (m[1] * dw) / sw,
        (m[2] * dh) / sh,
        (m[3] * dh) / sh,
        q[0],
        q[1],
      );
      sprite.setFromMatrix(imageMatrix);
      sprite.mask = null;
      if (this.imageClip) {
        const mask =
          this.imageMasks[this.si - 1] ||
          (this.imageMasks[this.si - 1] = new P.Graphics());
        const c = this.imageClip;
        mask.clear();
        for (const r of c.regions || [c])
          mask.rect(r.x, r.y, r.width, r.height);
        mask.fill(0xffffff);
        this.app.stage.addChild(mask);
        sprite.mask = mask;
      }
      // Raster glow joins the same half-resolution layer as vector line halos.
      if (
        this.vectorDisplay?.enabled &&
        (this.vectorDisplay.sprites !== "original" || this.assetGlow) &&
        this.beamAdded
      ) {
        const glow =
          this.beamSprites[this.bi] ||
          (this.beamSprites[this.bi] = new P.Sprite(texture));
        this.bi++;
        glow.texture = texture;
        glow.setFromMatrix(imageMatrix);
        glow.alpha = this.globalAlpha;
        glow.mask = sprite.mask;
        this.beamLayer.addChild(glow);
      }
      this.app.stage.addChild(sprite);
      this.graphic = null;
    }
    // Reuse a Pixi Text object and set shared Checkbook font, position, anchor and opacity.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.fillText.31 — Handles fill text within pixi renderer. Inputs: value; x; y. Updates: this texts at this ti; text text; text style font size; text style font family; text style fill. Uses: this flush stroke; string; number; this font match. */
    /* @function pixiRenderer.reviewed31 — Draws text using the established Checkbook font. Inputs: display value and x/y local logical pixels. Returns nothing; reuses a Text object, converts value to string and updates size/alignment/position/color/opacity. Flushes painter order; invalid Pixi/font values may propagate. DOM UI remains separate. */
    /* @function pixiRenderer.fillText1527 — October 22, 2026. Inputs: value and local logical-pixel x/y. Returns nothing; reuses GPU text, retaining size/alignment/color/opacity while choosing the registered gameplay family or readable editor family. Flushes painter order; invalid Pixi/font values propagate. Supersedes the fixed-family contract above. */ fillText(
      value,
      x,
      y,
    ) {
      this.flushStroke();
      const text =
        this.texts[this.ti] ||
        (this.texts[this.ti] = new P.Text({
          text: "",
          style: {
            fontFamily: "PhanicomCheckbook",
            fontSize: 12,
          },
        }));
      this.ti++;
      text.text = String(value);
      text.style.fontSize = Number(this.font.match(/([\d.]+)px/)?.[1] || 12);
      // October 22: active editor/gameplay font supersedes the historical fixed face above.
      text.style.fontFamily = root.FrontierFonts?.family() || "PhanicomCheckbook";
      text.style.fill = this.painted(this.fillStyle).color;
      text.alpha = this.globalAlpha;
      text.anchor.set(
        this.textAlign === "center" ? 0.5 : this.textAlign === "right" ? 1 : 0,
        1,
      );
      const q = this.point(x, y);
      text.position.set(...q);
      this.app.stage.addChild(text);
      this.graphic = null;
    }
    // Submit the assembled stage once; Pixi owns GPU work.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.end.32 — Handles end within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this app stage filters; this underwater filter; u u time; u u strength; u u frequency. Uses: this flush stroke; p gl program from; screen tone some; this app renderer render. */
    /* @function pixiRenderer.reviewed32 — Submits the assembled Pixi frame once. Inputs: none. Returns nothing; flushes vector strokes and applies reusable underwater, tone and breathing filters before rendering stage. Updates only captured effect uniforms/areas; DOM HUD is outside the passes. Does not step simulation or measure GPU elapsed time; renderer errors propagate. */ /* @function pixiRenderer.indexedEnd168 — Inputs: none. Submits original pooled world/effects, then optional original-plugin indexed pass and retained HUD compositor. Disabled maps keep the previous path; projection, sprite presentation and simulation remain unchanged. */ end() {
      this.flushStroke();
      const w = this.underwater;
      this.app.stage.filters = null;
      if (w?.underwaterEnabled && w.underwaterStrength > 0) {
        if (!this.underwaterFilter)
          this.underwaterFilter = new P.Filter({
            glProgram: P.GlProgram.from({
              vertex: P.defaultFilterVert,
              fragment: `in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform vec4 uInputClamp;uniform float uTime;uniform float uStrength;uniform float uFrequency;void main(){vec2 uv=vTextureCoord;uv.x+=sin(uv.y*6.283185*uFrequency+uTime)*uStrength;uv.y+=sin(uv.x*6.283185*uFrequency-uTime)*uStrength*0.35;finalColor=texture(uTexture,clamp(uv,uInputClamp.xy,uInputClamp.zw));}`,
            }),
            resources: {
              waterUniforms: {
                uTime: { value: 0, type: "f32" },
                uStrength: { value: 0, type: "f32" },
                uFrequency: { value: 4, type: "f32" },
              },
            },
          });
        const u = this.underwaterFilter.resources.waterUniforms.uniforms;
        u.uTime = w.time * w.underwaterSpeed;
        u.uStrength = w.underwaterStrength;
        u.uFrequency = w.underwaterFrequency;
        this.app.stage.filterArea = new P.Rectangle(
          0,
          0,
          this.app.screen.width,
          this.app.screen.height,
        );
        this.app.stage.filters = [this.underwaterFilter];
      }
      // Desaturating HSL at fixed lightness equals mixing RGB with (max+min)/2.
      // Reuse one GPU filter and append after underwater distortion; DOM UI is outside it.
      if (
        screenTone.some(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.callback.33 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0. */
          /* @function pixiRenderer.reviewed33 — Tests whether any screen-tone channel is active. Inputs: tone component v. Returns true for nonzero values; no mutation. The enclosing frame adds the tone filter only when needed. */ (
            v,
          ) => v !== 0,
        )
      ) {
        if (!this.toneFilter)
          this.toneFilter = new P.Filter({
            glProgram: P.GlProgram.from({
              vertex: P.defaultFilterVert,
              fragment:
                "precision highp float;in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform vec4 uTone;void main(){vec4 c=texture(uTexture,vTextureCoord);float hi=max(c.r,max(c.g,c.b));float lo=min(c.r,min(c.g,c.b));vec3 rgb=mix(c.rgb,vec3((hi+lo)*0.5),uTone.a/255.0);rgb=clamp(rgb+uTone.rgb*c.a/255.0,vec3(0.0),vec3(1.0));finalColor=vec4(rgb,c.a);}",
            }),
            resources: {
              toneUniforms: { uTone: { value: screenTone, type: "vec4<f32>" } },
            },
          });
        this.app.stage.filterArea = new P.Rectangle(
          0,
          0,
          this.app.screen.width,
          this.app.screen.height,
        );
        this.app.stage.filters = [
          ...(this.app.stage.filters || []),
          this.toneFilter,
        ];
      }
      /* October 10, 2026: radial breathing is a final world-only GPU pass. Reuse uniforms and filter; logical UV coordinates keep the effect independent of framebuffer density. The edge taper matches the input mapping and holds the screen border stationary. */
      const breath = this.breathing;
      if (breath?.strength > 0 && breath.amplitude > 0) {
        if (!this.breathingFilter)
          this.breathingFilter = new P.Filter({
            glProgram: P.GlProgram.from({
              vertex: P.defaultFilterVert,
              fragment: `precision highp float;in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform vec4 uInputSize,uOutputFrame,uInputClamp,uBreath;uniform float uAspect;void main(){vec2 uv=vTextureCoord*uInputSize.xy/uOutputFrame.zw;vec2 delta=(uv-.5)*vec2(uAspect,1.);float radial=1.-smoothstep(0.,1.,length(delta)/uBreath.z);float edge=smoothstep(0.,1.,min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y))/.08);float scale=1.+uBreath.x*sin(uBreath.y)*uBreath.w*radial*edge;vec2 scene=.5+(uv-.5)/scale;vec2 source=scene*uOutputFrame.zw/uInputSize.xy;finalColor=texture(uTexture,clamp(source,uInputClamp.xy,uInputClamp.zw));}`,
            }),
            resources: {
              breathUniforms: {
                uBreath: { value: new Float32Array(4), type: "vec4<f32>" },
                uAspect: { value: 1, type: "f32" },
              },
            },
          });
        const uniforms = this.breathingFilter.resources.breathUniforms.uniforms;
        uniforms.uBreath[0] = breath.amplitude;
        uniforms.uBreath[1] = breath.phase;
        uniforms.uBreath[2] = breath.radius;
        uniforms.uBreath[3] = breath.strength;
        uniforms.uAspect = this.app.screen.width / this.app.screen.height;
        this.breathingFilter.resolution = this.app.renderer.resolution;
        if (!this.breathingArea) this.breathingArea = new P.Rectangle();
        this.breathingArea.width = this.app.screen.width;
        this.breathingArea.height = this.app.screen.height;
        this.app.stage.filterArea = this.breathingArea;
        if (!this.breathingFilters) this.breathingFilters = [];
        this.breathingFilters.length = 0;
        if (this.app.stage.filters)
          for (const filter of this.app.stage.filters)
            this.breathingFilters.push(filter);
        this.breathingFilters.push(this.breathingFilter);
        this.app.stage.filters = this.breathingFilters;
      }
      root.FrontierPaletteDither?.apply(this);
      this.app.renderer.render({
        container: this.app.stage,
      });
    }
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.init.34 — Handles init within pixi renderer. Inputs: canvas. Updates: app; adapter; root frontier pixi backend; failed. Uses: document fonts load; app init; app stop. */
  /* @function pixiRenderer.reviewed34 — Initializes WebGL drawing for one game canvas. Inputs: canvas element. Returns a promise; loads Checkbook font, creates stopped Pixi Application with supported logical size/framebuffer density and installs DrawContext. On failure sets explicit Canvas fallback state and logs warning rather than claiming GPU success. */ async function init(
    canvas,
  ) {
    try {
      await document.fonts.load("12px PhanicomCheckbook");
      await document.fonts.load("12px FrontierArialRounded");
      app = new P.Application();
      await app.init({
        canvas,
        width: root.FrontierDisplay?.get().width || canvas.width,
        height: 480,
        autoStart: false,
        preference: "webgl",
        background: "#000",
        antialias: false,
        resolution: root.FrontierDisplay?.get().scale || 1,
      });
      app.stop();
      adapter = new DrawContext(app);
      root.FrontierPixi.backend = "PixiJS " + P.VERSION + " / WebGL";
    } catch (error) {
      failed = true;
      root.FrontierPixi.backend = "Canvas fallback";
      console.warn("Pixi initialization unavailable", error);
    }
  }
  // Initialize Pixi once, return null while starting, then reuse a drawing adapter and resize as needed.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.context.35 — Initialize Pixi once, return null while starting, then reuse a drawing adapter and resize as needed. Inputs: canvas. Updates: started. Uses: init; canvas get context; app renderer resize; adapter begin. Returns: canvas get context using "2d"; null. */
  /* @function pixiRenderer.reviewed35 — Obtains/reset the frame drawing context. Inputs: the game canvas. Returns null during asynchronous startup, Canvas 2D on failed Pixi initialization, or reused begun DrawContext. Resizes only for logical dimensions/density changes. Does not feed physical framebuffer size back into gameplay or create another application. */ function context(
    canvas,
  ) {
    if (!started) {
      started = true;
      init(canvas);
    }
    if (failed) return canvas.getContext("2d");
    if (!adapter) return null;
    /* October 10, 2026: physical framebuffer density is independent of logical projection and pointer units. Pixi owns physical canvas dimensions; never feed those dimensions back into gameplay. */ const display =
      root.FrontierDisplay?.get() || {
        width: canvas.width,
        height: 480,
        scale: 1,
      };
    if (
      app.screen.width !== display.width ||
      app.screen.height !== display.height ||
      app.renderer.resolution !== display.scale
    )
      app.renderer.resize(display.width, display.height, display.scale);
    adapter.begin();
    return adapter;
  }
  root.FrontierPixi = {
    /* @function pixi-renderer.current — Return the existing frame adapter without clearing its stage. Inputs: none. Returns: the adapter, or null before GPU initialization or after failure. Effects append to the scene assembled by the main renderer. */ current() {
      return failed ? null : adapter;
    },
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.releaseImage.36 — Handles release image within pixi renderer. Inputs: image. Uses: adapter sources get; adapter crops get using image values; adapter crops get; texture destroy. Returns: without a result. */
    /* @function pixiRenderer.reviewed36 — Releases image resources owned by the crop/sprite cache. Inputs: source image identity. Returns nothing; no-ops before adapter exists, otherwise destroys crop textures without double-destroying shared source, then deletes source/crop entries. Does not retire unrelated water/model textures or change source pixels. */ releaseImage(
      image,
    ) {
      if (!adapter) return;
      const source = adapter.sources.get(image);
      for (const texture of adapter.crops.get(image)?.values() || [])
        texture.destroy(false);
      source?.destroy();
      adapter.sources.delete(image);
      adapter.crops.delete(image);
    },
    // Refresh the GPU buffer immediately before copying; do not retain every frame.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.capture.37 — Handles capture within pixi renderer. Inputs: target. Uses: app renderer render; target get context using "2d" draw image; target get context; document get element by id. */
    /* @function pixiRenderer.reviewed37 — Captures current frame into a supplied Canvas. Inputs: target canvas with desired output dimensions. Returns nothing; refreshes GPU stage if available and copies the game view scaled to target. Does not retain every frame or alter the scene; unavailable canvas/context errors propagate. */ capture(
      target,
    ) {
      if (app && adapter && !failed)
        app.renderer.render({ container: app.stage });
      target
        .getContext("2d")
        .drawImage(
          document.getElementById("view"),
          0,
          0,
          target.width,
          target.height,
        );
    },
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.toneSupported.38 — Returns the inverse of failed. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of failed. */
    toneSupported:
      /* @function pixiRenderer.reviewed38 — Reports whether native Pixi tone remains available. Inputs: none. Returns inverse initialization-failed flag; before initialization it is provisional true. Read-only, not a completed GPU capability benchmark. */ () =>
        !failed /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.setTone.39 — Handles set tone within pixi renderer. Inputs: value. Uses: screen tone set. */,
    /* @function pixiRenderer.reviewed39 — Updates shared screen tone. Inputs: up to four numeric R/G/B offset/gray values, normally validated four-channel effect data. Returns nothing; writes shared Float32Array used by frame uniforms. Values are shader-scaled by 255; oversized arrays throw. Does not modify world textures or affect DOM HUD. */ setTone(
      value,
    ) {
      screenTone.set(value);
    },
    context /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.end.40 — Handles end within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: adapter end. */,
    /* @function pixiRenderer.reviewed40 — Ends the current frame through existing adapter. Inputs: none. Returns nothing; calls adapter.end if initialized, otherwise no-ops. Does not create a renderer, advance simulation or claim GPU completion. */ end() {
      adapter?.end();
    },
    backend: "Starting PixiJS",
    get app /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function pixi-renderer.app.41 — Handles app within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Returns: app. *//* @function pixiRenderer.reviewed41 — Reads the current Pixi Application. Inputs: none. Returns application reference or null before initialization. Caller must respect adapter resource ownership; getter performs no rendering/reset. */ () /* @function pixiRenderer.reviewed41 — Reads the current Pixi Application. Inputs: none. Returns application reference or null before initialization. Caller must respect adapter resource ownership; getter performs no rendering/reset. */ {
      return app;
    },
  };
})(window);
