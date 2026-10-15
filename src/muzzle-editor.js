/* MAINTAINER GUIDE
 * Standalone calibration UI embedded by the main game. Edits a local data copy until Apply posts it to the parent. Export preserves a project JSON copy; localStorage is convenience storage rather than a portable project format.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function muzzle-editor.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas onclick; $ using "aimMode" onchange; $ using "barrelDepth" onchange; $ using "clearBarrel" onclick; $ using "undoCalibration" onclick. Uses: $; canvas get context; structured clone; window add event listener. */
(/* @function muzzle-editor.bootstrapReviewed — Boots the standalone calibration document once. Inputs: none; requires its own canvas/controls and FrontierMuzzle schema. Returns nothing; binds pointer/import/export/Undo and trusted-parent message handlers, then refreshes a private calibration copy. Apply posts validated data to the parent; local persistence is convenience only. Invalid imports display errors without replacing the draft. Full-sheet pixels and degree angle offsets remain independent of source sprite proportions. */ function () {
  const $ =
      /* @function muzzle-editor.$.2 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */ (
        id,
      ) => document.getElementById(id),
    canvas = $("preview"),
    ctx = canvas.getContext("2d");
  let data = structuredClone(FrontierMuzzleData),
    image = FrontierCandy.image,
    pending,
    undo = [];
  /* @function muzzle-editor.remember.3 — Retains a bounded list of sufficiently separated safe player positions. Inputs: no explicit arguments; uses enclosing module state. Uses: undo push; structured clone; undo shift. */ function remember() {
    undo.push(structuredClone(data));
    if (undo.length > 30) undo.shift();
  }
  const profile =
      /* @function muzzle-editor.profile.4 — Returns data profiles find using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: data profiles find. Returns: data profiles find using a callback. */ () =>
        data.profiles.find(
          /* @function muzzle-editor.callback.5 — Returns p id equals $ using "profile" value. Inputs: p. Uses: $. Returns: p id equals $ using "profile" value. */ (
            p,
          ) => p.id === $("profile").value,
        ),
    indices =
      /* @function muzzle-editor.indices.6 — Returns a list of number using $ using "row" value, number using $ using "column" value. Inputs: no explicit arguments; uses enclosing module state. Uses: number; $. Returns: a list of number using $ using "row" value, number using $ using "column" value. */ () => [
        Number($("row").value),
        Number($("column").value),
      ];
  // Create missing frame calibration with center defaults; subsequent edits affect only the selected frame.
  /* @function muzzle-editor.selectedPoint.7 — Create missing frame calibration with center defaults; subsequent edits affect only the selected frame. Inputs: no explicit arguments; uses enclosing module state. Updates: p muzzles at row plus ":" plus col. Uses: profile; indices. Returns: assignment. */ function selectedPoint() {
    const p = profile(),
      [row, col] = indices();
    return (p.muzzles[row + ":" + col] ??= {
      x: col * p.frameWidth + p.frameWidth / 2,
      y: row * p.frameHeight + p.frameHeight / 2,
      flashX: col * p.frameWidth + p.frameWidth / 2,
      flashY: row * p.frameHeight + p.frameHeight / 2,
      yawOffset: 0,
      pitchOffset: 0,
    });
  }
  // Populate direction/frame controls and choose the correct sheet image for the selected profile.
  /* @function muzzle-editor.controls.8 — Populate direction/frame controls and choose the correct sheet image for the selected profile. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "rows" value; $ using "columns" value; $ using "referenceHeight" value; image; image src. Uses: profile; $ using "row" replace children; $; array from. */ function controls() {
    const p = profile();
    $("row").replaceChildren(
      ...Array.from(
        {
          length: p.rows,
        },
        /* @function muzzle-editor.callback.9 — Returns a new option. Inputs: ; i. Returns: a new option. */ (
          _,
          i,
        ) => new Option("Row " + (i + 1), i),
      ),
    );
    $("column").replaceChildren(
      ...Array.from(
        {
          length: p.columns,
        },
        /* @function muzzle-editor.callback.10 — Returns a new option. Inputs: ; i. Returns: a new option. */ (
          _,
          i,
        ) => new Option("Frame " + (i + 1), i),
      ),
    );
    $("rows").value = p.rows;
    $("columns").value = p.columns;
    $("referenceHeight").value = p.referenceHeight;
    image = p.id === "candy-armed" ? FrontierCandy.image : new Image();
    if (p.id !== "candy-armed") image.src = p.sheetData || p.sheet;
    image.onload = draw;
    read();
  }
  // Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range.
  /* @function muzzle-editor.refresh.11 — Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "profile" value. Uses: $; $ using "profile" replace children; data profiles map; data profiles some. */ function refresh() {
    const id = $("profile").value;
    $("profile").replaceChildren(
      ...data.profiles.map(
        /* @function muzzle-editor.callback.12 — Returns a new option. Inputs: p. Returns: a new option. */ (
          p,
        ) => new Option(p.id, p.id),
      ),
    );
    if (
      data.profiles.some(
        /* @function muzzle-editor.callback.13 — Returns p id equals id. Inputs: p. Returns: p id equals id. */ (
          p,
        ) => p.id === id,
      )
    )
      $("profile").value = id;
    controls();
  }
  // Populate numeric angle controls from the selected muzzle and redraw its markers.
  /* @function muzzle-editor.read.14 — Populate numeric angle controls from the selected muzzle and redraw its markers. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "aimMode" value; $ using "barrelDepth" value; $ using "yaw" value; $ using "pitch" value. Uses: selected point; $; profile; draw. */ function read() {
    const m = selectedPoint();
    $("aimMode").value = profile().aimMode || "cursor";
    $("barrelDepth").value = m.barrelDepth ?? 100;
    $("yaw").value = m.yawOffset || 0;
    $("pitch").value = m.pitchOffset || 0;
    draw();
  }
  /* @function muzzle-editor.draw.15 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; ctx image smoothing enabled; ctx fill style; ctx stroke style. Uses: profile; indices; selected point; ctx fill rect. */ function draw() {
    const p = profile(),
      [row, col] = indices(),
      m = selectedPoint();
    canvas.width = p.frameWidth;
    canvas.height = p.frameHeight;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (image.complete && image.naturalWidth)
      ctx.drawImage(
        image,
        col * p.frameWidth,
        row * p.frameHeight,
        p.frameWidth,
        p.frameHeight,
        0,
        0,
        p.frameWidth,
        p.frameHeight,
      );
    for (const [x, y, color] of [
      [m.x, m.y, "#00eaff"],
      [m.flashX, m.flashY, "#ff9c44"],
    ]) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(
        x - col * p.frameWidth,
        y - row * p.frameHeight,
        6,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    const x = m.x - col * p.frameWidth,
      y = m.y - row * p.frameHeight;
    ctx.strokeStyle = "#ff5577";
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (m.barrelX !== undefined) {
      ctx.lineTo(
        m.barrelX - col * p.frameWidth,
        m.barrelY - row * p.frameHeight,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        m.barrelX - col * p.frameWidth,
        m.barrelY - row * p.frameHeight,
        6,
        0,
        Math.PI * 2,
      );
    }
    ctx.stroke();
    $("result").textContent =
      "Origin " +
      Math.round(m.x) +
      ", " +
      Math.round(m.y) +
      " · Flash " +
      Math.round(m.flashX) +
      ", " +
      Math.round(m.flashY);
  }
  canvas.onclick =
    /* @function muzzle-editor.onclick.16 — Responds to a button or clickable control. Inputs: e. Updates: m x; m y; m barrel x; m barrel y; m barrel depth. Uses: profile; indices; canvas get bounding client rect; selected point. */ (
      e,
    ) => {
      const p = profile(),
        [row, col] = indices(),
        rect = canvas.getBoundingClientRect(),
        x =
          ((e.clientX - rect.left) * canvas.width) / rect.width +
          col * p.frameWidth,
        y =
          ((e.clientY - rect.top) * canvas.height) / rect.height +
          row * p.frameHeight,
        m = selectedPoint();
      remember();
      if ($("point").value === "muzzle") {
        m.x = x;
        m.y = y;
      } else if ($("point").value === "barrel") {
        m.barrelX = x;
        m.barrelY = y;
        m.barrelDepth = Number($("barrelDepth").value);
      } else {
        m.flashX = x;
        m.flashY = y;
      }
      draw();
    };
  $("aimMode").onchange =
    /* @function muzzle-editor.onchange.17 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: profile using aim mode. Uses: remember; profile; $; draw. */ () => {
      remember();
      profile().aimMode = $("aimMode").value;
      draw();
    };
  $("barrelDepth").onchange =
    /* @function muzzle-editor.onchange.18 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: selected point using barrel depth. Uses: remember; selected point; number; $. */ () => {
      remember();
      selectedPoint().barrelDepth = Number($("barrelDepth").value);
      draw();
    };
  $("clearBarrel").onclick =
    /* @function muzzle-editor.onclick.19 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: remember; selected point; read. */ () => {
      remember();
      const m = selectedPoint();
      delete m.barrelX;
      delete m.barrelY;
      delete m.barrelDepth;
      read();
    };
  $("undoCalibration").onclick =
    /* @function muzzle-editor.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: data; $ using "profile" value; $ using "row" value; $ using "column" value. Uses: $; indices; undo pop; refresh. */ () => {
      if (undo.length) {
        const id = $("profile").value,
          [row, col] = indices();
        data = undo.pop();
        refresh();
        $("profile").value = id;
        controls();
        $("row").value = row;
        $("column").value = col;
        read();
      }
    };
  $("yaw").onchange = $("pitch").onchange =
    /* @function muzzle-editor.onchange.21 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: m yaw offset; m pitch offset. Uses: remember; selected point; number; $. */ () => {
      remember();
      const m = selectedPoint();
      m.yawOffset = Number($("yaw").value);
      m.pitchOffset = Number($("pitch").value);
      draw();
    };
  $("referenceHeight").onchange =
    /* @function muzzle-editor.onchange.22 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: profile using reference height. Uses: remember; profile; number; $. */ () => {
      remember();
      profile().referenceHeight = Math.max(
        1,
        Number($("referenceHeight").value),
      );
      draw();
    };
  $("row").onchange = $("column").onchange = read;
  $("profile").onchange = controls;
  $("copyRow").onclick =
    /* @function muzzle-editor.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: p muzzles at row plus ":" plus i. Uses: profile; indices; structured clone; selected point. */ () => {
      const p = profile(),
        [row, col] = indices(),
        m = structuredClone(selectedPoint());
      remember();
      for (let i = 0; i < p.columns; i++)
        p.muzzles[row + ":" + i] = {
          ...m,
          x: m.x + (i - col) * p.frameWidth,
          flashX: m.flashX + (i - col) * p.frameWidth,
          ...(m.barrelX === undefined
            ? {}
            : { barrelX: m.barrelX + (i - col) * p.frameWidth }),
        };
      draw();
    };
  $("sheet").onchange =
    /* @function muzzle-editor.onchange.24 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "result" text content; pending. Uses: $. Returns: without a result; without a result. */ async () => {
      const file = $("sheet").files[0];
      if (!file) return;
      if (file.size > 8000000) {
        $("result").textContent = "Choose a sheet under 8 MB.";
        return;
      }
      pending = await new Promise(
        /* @function muzzle-editor.callback.25 — Provides the callback for the enclosing muzzle editor operation. Inputs: resolve. Updates: r onload. Uses: r read as data url. */ (
          resolve,
        ) => {
          const r = new FileReader();
          r.onload =
            /* @function muzzle-editor.onload.26 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using r result. */ () =>
              resolve(r.result);
          r.readAsDataURL(file);
        },
      );
    };
  $("newProfile").onclick =
    /* @function muzzle-editor.onclick.27 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: img src; $ using "profile" value; $ using "result" text content. Uses: img decode; error; number; $. Returns: without a result; without a result. */ async () => {
      try {
        if (!pending) return;
        const img = new Image();
        img.src = pending;
        await img.decode();
        if (img.width > 8192 || img.height > 8192)
          throw Error("Sheet must be at most 8192 pixels per side.");
        const rows = Math.max(1, Math.min(16, Number($("rows").value))),
          columns = Math.max(1, Math.min(12, Number($("columns").value))),
          w = img.width / columns,
          h = img.height / rows;
        if (!Number.isInteger(w) || !Number.isInteger(h)) {
          alert("Sheet dimensions must divide evenly.");
          return;
        }
        const id = "sprite-" + Date.now(),
          frames = [];
        for (let row = 0; row < rows; row++)
          for (let col = 0; col < columns; col++)
            frames.push({
              x: col * w,
              y: row * h,
              w,
              h,
              anchorX: w / 2,
            });
        remember();
        data.profiles.push({
          id,
          sheetData: pending,
          sheet: "img/characters/custom.png",
          rows,
          columns,
          frameWidth: w,
          frameHeight: h,
          referenceHeight: h,
          frames,
          direction: {
            rows: Array.from(
              {
                length: rows,
              },
              /* @function muzzle-editor.callback.28 — Returns i. Inputs: ; i. Returns: i. */ (
                _,
                i,
              ) => i,
            ),
            walkSequence: columns >= 3 ? [1, 2, 1, 0] : [0],
            frameSeconds: 0.14,
            idleColumn: Math.min(1, columns - 1),
          },
          muzzles: {},
        });
        refresh();
        $("profile").value = id;
        controls();
      } catch (e) {
        $("result").textContent = e.message;
      }
    };
  $("apply").onclick =
    /* @function muzzle-editor.onclick.29 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "result" text content. Uses: frontier muzzle validate; window parent post message; $. */ () => {
      try {
        FrontierMuzzle.validate(data);
        window.parent.postMessage(
          {
            type: "phanicom-muzzles",
            data,
          },
          "*",
        );
        $("result").textContent =
          "Applied. Export JSON to keep a project copy.";
      } catch (e) {
        $("result").textContent = e.message;
      }
    };
  $("export").onclick =
    /* @function muzzle-editor.onclick.30 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "result" text content; a href; a download. Uses: frontier muzzle validate; $; document create element; url create object url. Returns: without a result. */ () => {
      try {
        FrontierMuzzle.validate(data);
      } catch (e) {
        $("result").textContent = e.message;
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        }),
      );
      a.download = "muzzles.json";
      a.click();
      setTimeout(
        /* @function muzzle-editor.callback.31 — Returns url revoke object url using a href. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using a href. */ () =>
          URL.revokeObjectURL(a.href),
        1000,
      );
    };
  $("import").onchange =
    /* @function muzzle-editor.onchange.32 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: data; $ using "result" text content. Uses: frontier muzzle validate; json parse; $ using "import" files at 0 text; $. */ async () => {
      try {
        const incoming = FrontierMuzzle.validate(
          JSON.parse(await $("import").files[0].text()),
        );
        remember();
        data = incoming;
        refresh();
      } catch (e) {
        $("result").textContent = e.message;
      }
    };
  window.addEventListener(
    "message",
    /* @function muzzle-editor.callback.33 — Provides the callback for window add event listener. Inputs: event. Updates: data; undo. Uses: frontier muzzle validate; refresh. */ (
      event,
    ) => {
      if (
        event.source === parent &&
        event.data?.type === "phanicom-muzzle-open"
      ) {
        data = FrontierMuzzle.validate(event.data.data);
        undo = [];
        refresh();
      }
    },
  );
  refresh();
})();
