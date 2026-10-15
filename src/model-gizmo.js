/* Draft-only volume gizmo. Screen-axis projection gives deterministic
 * local-axis movement under rotated/scaled parents; no live event is mutated. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-gizmo.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model gizmo. */
(/* @function model-gizmo.installReviewed — Installs draft-only model-volume transformation handles. Screen-axis projection resolves local movement under rotated/scaled parents; manipulation does not directly mutate live runtime entities. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.apply.2 — Handles apply within model gizmo. Inputs: box; mode; axis; amount. Updates: box transform position at axis; box transform rotation at axis; box size at axis. */
  /* @function model-gizmo.reviewedapply_2 — Adjusts one event-draft volume axis. Inputs: box, mode, axis index0-2 and projected local amount. Returns undefined; move adds amount metres to position, rotate adds amount*30 degrees, other mode resizes by amount*2 metres clamped0.01. Does not validate mode/axis/finiteness; owner supplies valid draft and later Apply validation. No live entity/project commit. */ function apply(
    box,
    mode,
    axis,
    amount,
  ) {
    if (mode === "move") box.transform.position[axis] += amount;
    else if (mode === "rotate") box.transform.rotation[axis] += amount * 30;
    else box.size[axis] = Math.max(0.01, box.size[axis] + amount * 2);
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.open.3 — Handles open within model gizmo. Inputs: box; spatial; changed. Updates: d class name; d style css text; title text content; help text content; canvas width. Uses: document create element; d set attribute; mode set attribute; mode append. Returns: a record containing canvas, draw. */
  /* @function model-gizmo.reviewedopen_3 — Opens draft-only collision/zone handle dialog. Inputs: mutable draft box, spatial parent rotation/scale/modelId and synchronous changed callback. Returns canvas/draw API, creates modal/listeners and initial draw. Parent excludes placed-world translation; viewport is independent640x480 preview. Drag changes draft immediately, closing calls changed for form refresh and removes dialog; source commit belongs to outer event Apply. Errors propagate; no separate Undo/cancel rollback here. */ function open(
    box,
    spatial,
    changed,
  ) {
    const d = document.createElement("dialog");
    d.className = "mzDialog";
    d.setAttribute("aria-label", "Edit volume handles");
    d.style.cssText = "width:min(760px,94vw);font:18px Arial";
    const title = document.createElement("h2");
    title.textContent = "Edit " + (box.name || box.id);
    const help = document.createElement("p");
    help.textContent =
      "Drag a colored axis handle. Move uses model-local axes; resize and rotation use box-local axes. Changes stay in your event draft.";
    const mode = document.createElement("select");
    mode.setAttribute("aria-label", "Handle tool");
    for (const [value, label] of [
      ["move", "Move"],
      ["rotate", "Rotate"],
      ["resize", "Resize"],
    ])
      mode.append(new Option(label, value));
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.cssText = "width:100%;touch-action:none;background:#101827";
    const status = document.createElement("p"),
      done = document.createElement("button");
    done.textContent = "Done";
    done.onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.onclick.4 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */
  /* @function model-gizmo.reviewedonclick_4 — Closes handle dialog on Done. Inputs: ignored click. Returns dialog.close result; close listener refreshes owner. Draft edits are retained, not committed to source here. */ () =>
        d.close();
    d.append(title, help, mode, canvas, status, done);
    document.body.append(d);
    d.addEventListener(
      "close",
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.5 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: changed; d remove. */
  /* @function model-gizmo.reviewedcallback_5 — Refreshes owner after handle dialog closes. Inputs: ignored close event. Returns undefined; invokes changed then removes dialog. Callback error prevents removal because no finally; no source commit. */ () => {
        changed();
        d.remove();
      },
    );
    d.showModal();
    const T = FrontierModelTransform,
      parent = T.matrix({ rotation: spatial.rotation, scale: spatial.scale }),
      colors = ["#ff8080", "#80ff90", "#80bfff"];
    let handles = [],
      drag = null;
    const asset = FrontierModelLibrary.get(spatial.modelId);
    let extent = Math.max(...box.size, 2);
    if (asset?.scene)
      extent = Math.max(
        extent,
        ...asset.scene.bounds.max.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.6 — Returns v minus asset scene bounds min at i. Inputs: v; i. Returns: v minus asset scene bounds min at i. */
  /* @function model-gizmo.reviewedcallback_6 — Measures imported mesh extent for preview scale. Inputs: bound maximum v/index i and captured asset. Returns max-min metres; no mutation. */ (
            v,
            i,
          ) => v - asset.scene.bounds.min[i],
        ),
      );
    const scale = 150 / extent;
    const project =
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.project.7 — Converts a world-space position into this renderer’s screen-space representation. Inputs: p. Returns: a record containing x, y. */
  /* @function model-gizmo.reviewedproject_7 — Projects preview-local XYZ into gizmo canvas. Inputs: p in transformed model metres. Returns fixed affine logical pixels centred320/330 with captured extent scale; independent from gameplay camera. No mutation or perspective division. */ (
        p,
      ) => ({
        x: 320 + (p[0] - 0.6 * p[1]) * scale,
        y: 330 + (0.35 * p[0] + 0.5 * p[1] - p[2]) * scale,
      });
    /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Updates: ctx stroke style; ctx line width; handles; v at axis; ctx fill style. Uses: canvas get context; ctx clear rect; ctx begin path; frontier model scene triangles. */
  /* @function model-gizmo.revieweddraw_8 — Redraws local model/volume preview and axis handles. Inputs: none. Returns undefined; clears640x480 canvas, draws shared model wireframe and transformed volume edges, constructs projected X/Y/Z handles and numeric status. Move axes follow parent; rotation/resize axes follow box rotation/scale. Skips projected axes shorter0.001 pixel to avoid division. Mutates canvas/local handles only, not asset/draft. Rendering/transform errors propagate. */ function draw() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 640, 480);
      if (asset?.scene) {
        ctx.strokeStyle = "#526480";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        FrontierModelScene.triangles(
          asset,
          asset.scene,
          parent,
          /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.9 — Provides the callback for frontier model scene triangles. Inputs: points. Uses: points map; ctx move to; ctx line to. */
  /* @function model-gizmo.reviewedcallback_9 — Appends model triangle wireframe to preview path. Inputs: transformed points. Returns undefined; projects/draws closed triangle path, no geometry mutation. */ (
            points,
          ) => {
            const q = points.map(project);
            ctx.moveTo(q[0].x, q[0].y);
            ctx.lineTo(q[1].x, q[1].y);
            ctx.lineTo(q[2].x, q[2].y);
            ctx.lineTo(q[0].x, q[0].y);
          },
        );
        ctx.stroke();
      }
      const corners = T.corners(box, parent).map(project);
      ctx.strokeStyle = "#60f2df";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++)
        for (const bit of [1, 2, 4])
          if (!(i & bit)) {
            ctx.moveTo(corners[i].x, corners[i].y);
            ctx.lineTo(corners[i | bit].x, corners[i | bit].y);
          }
      ctx.stroke();
      const center = T.vector(parent, box.transform.position),
        origin = project(center),
        axes =
          mode.value === "move"
            ? parent
            : T.multiply(
                parent,
                T.matrix({
                  rotation: box.transform.rotation,
                  scale: box.transform.scale,
                }),
              );
      handles = [];
      for (let axis = 0; axis < 3; axis++) {
        const v = [0, 0, 0];
        v[axis] = 1;
        const world = T.vector(axes, v, 0),
          unit = project(
            center.map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.10 — Returns n plus world at i. Inputs: n; i. Returns: n plus world at i. */
  /* @function model-gizmo.reviewedcallback_10 — Adds one transformed axis component to volume centre. Inputs: centre n/index i and captured world axis. Returns new endpoint component metres; no mutation. */ (
                n,
                i,
              ) => n + world[i],
            ),
          ),
          dx = unit.x - origin.x,
          dy = unit.y - origin.y,
          length = Math.hypot(dx, dy);
        if (length < 0.001) continue;
        const h = {
          axis,
          dx,
          dy,
          x: origin.x + (dx / length) * 75,
          y: origin.y + (dy / length) * 75,
        };
        handles.push(h);
        ctx.strokeStyle = ctx.fillStyle = colors[axis];
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(h.x, h.y);
        ctx.stroke();
        ctx.fillRect(h.x - 7, h.y - 7, 14, 14);
        ctx.font = "18px Arial";
        ctx.fillText("XYZ"[axis], h.x + 10, h.y);
      }
      status.textContent =
        "Center " +
        box.transform.position
          .map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.11 — Returns n to fixed using 2. Inputs: n. Uses: n to fixed. Returns: n to fixed using 2. */
  /* @function model-gizmo.reviewedcallback_11 — Formats centre coordinate status. Inputs: n metres. Returns2-decimal string; no mutation. */ (
              n,
            ) => n.toFixed(2),
          )
          .join(", ") +
        " | Size " +
        box.size
          .map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.12 — Returns n to fixed using 2. Inputs: n. Uses: n to fixed. Returns: n to fixed using 2. */
  /* @function model-gizmo.reviewedcallback_12 — Formats volume size status. Inputs: n metres. Returns2-decimal string; no mutation. */ (
              n,
            ) => n.toFixed(2),
          )
          .join(", ") +
        " | Rotation " +
        box.transform.rotation
          .map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.13 — Returns n to fixed using 1. Inputs: n. Uses: n to fixed. Returns: n to fixed using 1. */
  /* @function model-gizmo.reviewedcallback_13 — Formats rotation status. Inputs: n degrees. Returns1-decimal string; no mutation. */ (
              n,
            ) => n.toFixed(1),
          )
          .join(", ");
    }
    const pointer =
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.pointer.14 — Handles pointer within model gizmo. Inputs: e. Uses: canvas get bounding client rect. Returns: a record containing x, y. */
  /* @function model-gizmo.reviewedpointer_14 — Maps DOM pointer to gizmo logical canvas. Inputs: e.clientX/clientY CSS pixels. Returns640x480 logical x/y from current canvas rect; no mutation. Assumes nonzero rect dimensions. */ (
        e,
      ) => {
        const r = canvas.getBoundingClientRect();
        return {
          x: ((e.clientX - r.left) * 640) / r.width,
          y: ((e.clientY - r.top) * 480) / r.height,
        };
      };
    canvas.onpointerdown =
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.onpointerdown.15 — Begins the pointer-driven interaction. Inputs: e. Updates: drag. Uses: pointer; handles find; canvas set pointer capture. Returns: without a result. */
  /* @function model-gizmo.reviewedonpointerdown_15 — Begins handle drag near a projected axis endpoint. Inputs: pointer e. Returns undefined; resolves hit within18 logical pixels, captures axis/mode/last point and pointer capture; no-op miss. Does not itself change draft; no mouse-button filter here. */ (
        e,
      ) => {
        const p = pointer(e),
          h = handles.find(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.callback.16 — Returns math hypot using p x minus h x, p y minus h y is less than 18. Inputs: h. Returns: math hypot using p x minus h x, p y minus h y is less than 18. */
  /* @function model-gizmo.reviewedcallback_16 — Tests pointer proximity to one handle. Inputs: h and captured p. Returns distance<18 logical pixels; no mutation, first matching axis wins. */ (
              h,
            ) => Math.hypot(p.x - h.x, p.y - h.y) < 18,
          );
        if (!h) return;
        drag = { ...h, last: p, mode: mode.value };
        canvas.setPointerCapture(e.pointerId);
      };
    canvas.onpointermove =
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.onpointermove.17 — Updates the active pointer-driven interaction. Inputs: e. Updates: drag last. Uses: pointer; apply; draw. Returns: without a result. */
  /* @function model-gizmo.reviewedonpointermove_17 — Applies projected motion to draft handle axis. Inputs: pointer e. Returns undefined; no-op without drag, otherwise computes local amount from dot projection/axis length squared, applies draft adjustment, updates last point and redraws. Asset/source/playtest unchanged; errors propagate with no gesture rollback. */ (
        e,
      ) => {
        if (!drag) return;
        const p = pointer(e),
          amount =
            ((p.x - drag.last.x) * drag.dx + (p.y - drag.last.y) * drag.dy) /
            (drag.dx * drag.dx + drag.dy * drag.dy);
        apply(box, drag.mode, drag.axis, amount);
        drag.last = p;
        draw();
      };
    canvas.onpointerup = canvas.onpointercancel =
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-gizmo.onpointercancel.18 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: drag. Returns: assignment. */
  /* @function model-gizmo.reviewedonpointercancel_18 — Ends gizmo drag on release or cancellation. Inputs: ignored pointer event. Returns assigned null; clears drag only. Already applied draft changes remain; cancellation is not Undo and outer event Apply remains commit boundary. */ () =>
        (drag = null);
    mode.onchange = draw;
    draw();
    return { canvas, draw };
  }
  root.FrontierModelGizmo = { open, apply };
})(typeof window === "undefined" ? globalThis : window);
