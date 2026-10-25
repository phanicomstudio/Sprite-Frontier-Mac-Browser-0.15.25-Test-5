/* Parameter-dialog presentation registry. Every command owns its own layout.
 * This module never commits an event; it returns one validated draft command. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-dialogs.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzdialogs. Uses: register. */
(/* @function mz-dialogs.installReviewed — Installs command-specific parameter-dialog presenters. Each operation returns a validated private command draft; the owning editor alone commits authored event changes. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const builders = new Map();
  /* @function mz-dialogs.register.2 — Handles register within mz dialogs. Inputs: code; builder. Uses: builders has; error; builders set. */ function register(
    code,
    builder,
  ) {
    if (builders.has(code) || typeof builder !== "function")
      throw Error("Duplicate or invalid command dialog.");
    builders.set(code, builder);
  }
  const select =
    /* @function mz-dialogs.select.3 — Handles select within mz dialogs. Inputs: id; items; value. Updates: s id; s value. Uses: document create element; s append; string. Returns: s. */ (
      id,
      items,
      value,
    ) => {
      const s = document.createElement("select");
      s.id = id;
      for (const [key, label] of items) s.append(new Option(label, key));
      s.value = String(value);
      return s;
    };
  const number =
    /* @function mz-dialogs.number.4 — Handles number within mz dialogs. Inputs: id; value; assignment pattern; assignment pattern. Uses: document create element; object assign. Returns: e. */ (
      id,
      value,
      min = -99999999,
      max = 99999999,
    ) => {
      const e = document.createElement("input");
      Object.assign(e, { id, type: "number", value, min, max, step: 1 });
      return e;
    };
  /* @function mz-dialogs.field.5 — Handles field within mz dialogs. Inputs: parent; label; control. Updates: e text content. Uses: document create element; e append; parent append. Returns: control. */ function field(
    parent,
    label,
    control,
  ) {
    const e = document.createElement("label");
    e.textContent = label;
    e.append(control);
    parent.append(e);
    return control;
  }
  /* @function mz-dialogs.group.6 — Handles group within mz dialogs. Inputs: parent; title. Updates: l text content. Uses: document create element; e append; parent append. Returns: e. */ function group(
    parent,
    title,
  ) {
    const e = document.createElement("fieldset"),
      l = document.createElement("legend");
    l.textContent = title;
    e.append(l);
    parent.append(e);
    return e;
  }
  /* @function mz-dialogs.textarea.7 — Handles textarea within mz dialogs. Inputs: value. Updates: e value; e rows. Uses: document create element. Returns: e. */ function textarea(
    value,
  ) {
    const e = document.createElement("textarea");
    e.value = value;
    e.rows = 4;
    return e;
  }
  /* @function mz-dialogs.open.8 — Handles open within mz dialogs. Inputs: code; initial; on apply; assignment pattern. Updates: d class name; title text content; status class name; ok text content; cancel text content. Uses: builders get; error; document create element; d set attribute. */ function open(
    code,
    initial,
    onApply,
    context = {},
  ) {
    const builder = builders.get(code);
    if (!builder)
      throw Error("Dedicated dialog is not implemented for command " + code);
    const d = document.createElement("dialog");
    d.className = "mzDialog mzParameters";
    d.setAttribute(
      "aria-label",
      root.FrontierMZCommands.metadata(code)?.name || "Event Command",
    );
    const title = document.createElement("h2");
    title.textContent =
      root.FrontierMZCommands.metadata(code)?.name || "Event Command";
    d.append(title);
    const body = document.createElement("section");
    d.append(body);
    const reader = builder(body, initial, context);
    const status = document.createElement("p");
    status.className = "mzStatus";
    d.append(status);
    const footer = document.createElement("footer");
    const ok = document.createElement("button"),
      cancel = document.createElement("button");
    ok.textContent = "OK";
    cancel.textContent = "Cancel";
    footer.append(ok, cancel);
    d.append(footer);
    cancel.onclick =
      /* @function mz-dialogs.onclick.9 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */ () =>
        d.close();
    ok.onclick =
      /* @function mz-dialogs.onclick.10 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: root frontier mzcommands validate; reader; on apply; d close. */ () => {
        try {
          const record = root.FrontierMZCommands.validate({
            ...initial,
            type: "mz",
            code,
            indent: initial?.indent || 0,
            parameters: [],
            ...reader(),
            extensions: initial?.extensions || {},
          });
          onApply(record);
          d.close();
        } catch (e) {
          status.textContent = e.message;
        }
      };
    d.addEventListener(
      "close",
      /* @function mz-dialogs.callback.11 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: reader dispose; d remove. */ () => {
        reader.dispose?.();
        d.remove();
      },
    );
    document.body.append(d);
    d.showModal();
    body.querySelector("input,select,textarea")?.focus();
  }
  register(
    101,
    /* @function mz-dialogs.callback.12 — Provides the callback for register. Inputs: body; c. Updates: upper class name; empty class name; empty text content; info text content. Uses: document create element; body append; group; face append. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || ["", 0, 0, 2, ""];
      const upper = document.createElement("div");
      upper.className = "mzTextUpper";
      body.append(upper);
      const face = group(upper, "Face"),
        empty = document.createElement("div");
      empty.className = "mzChecker";
      empty.textContent = p[0] || "(None)";
      face.append(empty);
      const info = document.createElement("p");
      info.textContent = "Face selection/preview integration is pending.";
      face.append(info);
      const settings = group(upper, "Settings");
      const name = field(
          settings,
          "Name",
          Object.assign(document.createElement("input"), { value: p[4] }),
        ),
        bg = field(
          settings,
          "Background",
          select(
            "mzTextBackground",
            [
              [0, "Window"],
              [1, "Dim"],
              [2, "Transparent"],
            ],
            p[2],
          ),
        ),
        position = field(
          settings,
          "Window Position",
          select(
            "mzTextPosition",
            [
              [0, "Top"],
              [1, "Middle"],
              [2, "Bottom"],
            ],
            p[3],
          ),
        );
      const text = field(body, "Text", textarea((c?.lines || []).join("\n")));
      return /* @function mz-dialogs.callback.13 — Returns a record containing parameters, lines. Inputs: no explicit arguments; uses enclosing module state. Uses: text value split. Returns: a record containing parameters, lines. */ () => ({
        parameters: [p[0], p[1], +bg.value, +position.value, name.value],
        lines: text.value.split("\n"),
      });
    },
  );
  register(
    108,
    /* @function mz-dialogs.callback.14 — Provides the callback for register. Inputs: body; c. Uses: field; textarea; chain or a list of join. Returns: a callback. */ (
      body,
      c,
    ) => {
      const text = field(
        body,
        "Comment",
        textarea((c?.lines || []).join("\n")),
      );
      return /* @function mz-dialogs.callback.15 — Returns a record containing parameters, lines. Inputs: no explicit arguments; uses enclosing module state. Uses: text value split. Returns: a record containing parameters, lines. */ () => ({
        parameters: [],
        lines: text.value.split("\n"),
      });
    },
  );
  register(
    121,
    /* @function mz-dialogs.callback.16 — Provides the callback for register. Inputs: body; c. Uses: group; field; number; select. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [1, 1, 0],
        ids = group(body, "Switches");
      const from = field(
          ids,
          "Single / range start",
          number("mzSwitchStart", p[0], 1, 5000),
        ),
        to = field(ids, "Range end", number("mzSwitchEnd", p[1], 1, 5000)),
        op = field(
          group(body, "Operation"),
          "Set",
          select(
            "mzSwitchOperation",
            [
              [0, "ON"],
              [1, "OFF"],
            ],
            p[2],
          ),
        );
      return /* @function mz-dialogs.callback.17 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+from.value, +to.value, +op.value],
      });
    },
  );
  register(
    122,
    /* @function mz-dialogs.callback.18 — Provides the callback for register. Inputs: body; c. Updates: type onchange; pending text content. Uses: group; field; number; select. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [1, 1, 0, 0, 0],
        ids = group(body, "Variables");
      const from = field(
          ids,
          "Single / range start",
          number("mzVariableStart", p[0], 1, 5000),
        ),
        to = field(ids, "Range end", number("mzVariableEnd", p[1], 1, 5000)),
        op = field(
          group(body, "Operation"),
          "Operation",
          select(
            "mzVariableOperation",
            [
              [0, "Set"],
              [1, "Add"],
              [2, "Subtract"],
              [3, "Multiply"],
              [4, "Divide"],
              [5, "Modulo"],
            ],
            p[2],
          ),
        );
      const operandGroup = group(body, "Operand"),
        type = field(
          operandGroup,
          "Type",
          select(
            "mzVariableOperand",
            [
              [0, "Constant"],
              [1, "Variable"],
              [2, "Random"],
              [3, "Game Data — pending"],
              [4, "Script — pending"],
            ],
            p[3],
          ),
        ),
        controls = document.createElement("section");
      operandGroup.append(controls);
      let read;
      /* @function mz-dialogs.rebuild.19 — Handles rebuild within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: controls text content; read. Uses: controls replace children; field; number. Returns: without a result. */ function rebuild() {
        controls.replaceChildren();
        const t = +type.value;
        if (t > 2) {
          controls.textContent =
            "This operand is preserved but execution is unsupported.";
          read =
            /* @function mz-dialogs.read.20 — Returns p slice using 3. Inputs: no explicit arguments; uses enclosing module state. Uses: p slice. Returns: p slice using 3. */ () =>
              p.slice(3);
          return;
        }
        if (t === 0) {
          const n = field(
            controls,
            "Constant",
            number("mzVariableConstant", p[3] === 0 ? p[4] : 0),
          );
          read =
            /* @function mz-dialogs.read.21 — Returns a list of 0, + n value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 0, + n value. */ () => [
              0,
              +n.value,
            ];
        } else if (t === 1) {
          const n = field(
            controls,
            "Variable ID",
            number("mzVariableOperandId", p[3] === 1 ? p[4] : 1, 1, 5000),
          );
          read =
            /* @function mz-dialogs.read.22 — Returns a list of 1, + n value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, + n value. */ () => [
              1,
              +n.value,
            ];
        } else {
          const a = field(
              controls,
              "Minimum",
              number("mzVariableRandomMin", p[3] === 2 ? p[4] : 0),
            ),
            b = field(
              controls,
              "Maximum",
              number("mzVariableRandomMax", p[3] === 2 ? p[5] : 100),
            );
          read =
            /* @function mz-dialogs.read.23 — Returns a list of 2, + a value, + b value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 2, + a value, + b value. */ () => [
              2,
              +a.value,
              +b.value,
            ];
        }
      }
      type.onchange = rebuild;
      rebuild();
      const pending = document.createElement("p");
      pending.textContent = "Game Data and Script operands are pending.";
      body.append(pending);
      return /* @function mz-dialogs.callback.24 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: read. Returns: a record containing parameters. */ () => ({
        parameters: [+from.value, +to.value, +op.value, ...read()],
      });
    },
  );
  register(
    123,
    /* @function mz-dialogs.callback.25 — Provides the callback for register. Inputs: body; c. Uses: field; select; a list of "A", "B", "C", "D" map. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || ["A", 0],
        key = field(
          body,
          "Self Switch",
          select(
            "mzSelfSwitch",
            ["A", "B", "C", "D"].map(
              /* @function mz-dialogs.callback.26 — Returns a list of x, x. Inputs: x. Returns: a list of x, x. */ (
                x,
              ) => [x, x],
            ),
            p[0],
          ),
        ),
        op = field(
          body,
          "Operation",
          select(
            "mzSelfSwitchOperation",
            [
              [0, "ON"],
              [1, "OFF"],
            ],
            p[1],
          ),
        );
      return /* @function mz-dialogs.callback.27 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [key.value, +op.value],
      });
    },
  );
  register(
    250,
    /* @function mz-dialogs.callback.28 — Provides the callback for register. Inputs: body; c. Updates: layout class name; name size; status role; b type; b text content. Uses: root phanicom audio manifest or a list of map; names map; names includes; choices push. Returns: read. */ (
      body,
      c,
    ) => {
      const initial = c?.parameters[0] || {
          name: "",
          volume: 90,
          pitch: 100,
          pan: 0,
        },
        names = (root.PhanicomAudioManifest || []).map(
          /* @function mz-dialogs.callback.29 — Returns a name. Inputs: a. Returns: a name. */ (
            a,
          ) => a.name,
        ),
        choices = [
          ["", "(None)"],
          ...names.map(
            /* @function mz-dialogs.callback.30 — Returns a list of n, n. Inputs: n. Returns: a list of n, n. */ (
              n,
            ) => [n, n],
          ),
        ];
      if (initial.name && !names.includes(initial.name))
        choices.push([initial.name, initial.name + " — missing resource"]);
      const layout = document.createElement("div");
      layout.className = "mzAudioLayout";
      body.append(layout);
      const list = document.createElement("div"),
        settings = document.createElement("div");
      layout.append(list, settings);
      const name = field(
        list,
        "Sound Effect",
        select("mzSEName", choices, initial.name),
      );
      name.size = 14;
      const buttons = document.createElement("div");
      settings.append(buttons);
      /* @function mz-dialogs.parameter.31 — Handles parameter within mz dialogs. Inputs: title; value; min; max. Updates: slider type; slider oninput; input oninput. Uses: group; number; slider set attribute; g append. Returns: input. */ function parameter(
        title,
        value,
        min,
        max,
      ) {
        const g = group(settings, title),
          slider = number("mzSE" + title + "Slider", value, min, max);
        slider.type = "range";
        slider.setAttribute("aria-label", title + " slider");
        g.append(slider);
        const input = field(g, title, number("mzSE" + title, value, min, max));
        slider.oninput =
          /* @function mz-dialogs.oninput.32 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: input value. Returns: assignment. */ () =>
            (input.value = slider.value);
        input.oninput =
          /* @function mz-dialogs.oninput.33 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: slider value. Returns: assignment. */ () =>
            (slider.value = input.value);
        return input;
      }
      const volume = parameter("Volume", initial.volume, 0, 100),
        pitch = parameter("Pitch", initial.pitch, 50, 150),
        pan = parameter("Pan", initial.pan, -100, 100),
        status = document.createElement("p");
      status.role = "status";
      body.append(status);
      const read =
        /* @function mz-dialogs.read.34 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
          parameters: [
            {
              ...initial,
              name: name.value,
              volume: +volume.value,
              pitch: +pitch.value,
              pan: +pan.value,
            },
          ],
        });
      for (const [label, fn] of [
        [
          "Play",
          /* @function mz-dialogs.callback.35 — Returns root phanicom se preview event using read using parameters at 0, a callback catch using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se preview event using read using parameters at 0, a callback catch; root phanicom se preview event; read. Returns: root phanicom se preview event using read using parameters at 0, a callback catch using a callback. */ () =>
            root.PhanicomSE.previewEvent(
              read().parameters[0],
              /* @function mz-dialogs.callback.36 — Returns assignment. Inputs: text. Updates: status text content. Returns: assignment. */ (
                text,
              ) => (status.textContent = text),
            ).catch(
              /* @function mz-dialogs.callback.37 — Returns assignment. Inputs: e. Updates: status text content. Returns: assignment. */ (
                e,
              ) => (status.textContent = e.message),
            ),
        ],
        [
          "Stop",
          /* @function mz-dialogs.callback.38 — Returns root phanicom se stop preview using . Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se stop preview. Returns: root phanicom se stop preview using . */ () =>
            root.PhanicomSE.stopPreview(),
        ],
      ]) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.onclick = fn;
        buttons.append(b);
      }
      read.dispose =
        /* @function mz-dialogs.dispose.39 — Returns root phanicom se stop preview using . Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se stop preview. Returns: root phanicom se stop preview using . */ () =>
          root.PhanicomSE.stopPreview();
      return read;
    },
  );
  register(
    223,
    /* @function mz-dialogs.callback.40 — Provides the callback for register. Inputs: body; c. Updates: layout class name; preview id; preview width; preview height; ctx fill style. Uses: group; document create element; colors append; layout append. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [[0, 0, 0, 0], 60, true],
        colors = group(body, "Color Tone"),
        layout = document.createElement("div");
      layout.className = "mzToneLayout";
      colors.append(layout);
      const settings = document.createElement("div");
      layout.append(settings);
      const sliders = [],
        channels = ["Red", "Green", "Blue", "Gray"].map(
          /* @function mz-dialogs.callback.41 — Provides the callback for a list of "Red", "Green", "Blue", "Gray" map. Inputs: name; i. Updates: row class name; slider type. Uses: document create element; settings append; number; slider set attribute. Returns: field using row, name, number using "mzTone" plus name, p at 0 at i, i equals 3 selects 0 or - 255. */ (
            name,
            i,
          ) => {
            const row = document.createElement("div");
            row.className = "mzToneRow";
            settings.append(row);
            const slider = number(
              "mzTone" + name + "Slider",
              p[0][i],
              i === 3 ? 0 : -255,
              255,
            );
            slider.type = "range";
            slider.setAttribute("aria-label", name + " slider");
            sliders.push(slider);
            row.append(slider);
            return field(
              row,
              name,
              number("mzTone" + name, p[0][i], i === 3 ? 0 : -255, 255),
            );
          },
        );
      // The preview is generated once and recolored only on authoring input.
      const preview = document.createElement("canvas");
      preview.id = "mzTonePreview";
      preview.width = 120;
      preview.height = 160;
      preview.setAttribute("aria-label", "Tone color preview");
      layout.append(preview);
      const ctx = preview.getContext("2d");
      for (let y = 0; y < preview.height; y++) {
        const gradient = ctx.createLinearGradient(0, 0, preview.width, 0);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(
          0.5,
          "hsl(" + (y / preview.height) * 360 + ",100%,50%)",
        );
        gradient.addColorStop(1, "white");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, preview.width, 1);
      }
      const base = ctx.getImageData(0, 0, preview.width, preview.height);
      /* @function mz-dialogs.repaint.42 — Handles repaint within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: i; image data at i plus k. Uses: channels map; ctx put image data. */ function repaint() {
        const values = channels.map(
            /* @function mz-dialogs.callback.43 — Returns + e value. Inputs: e. Returns: + e value. */ (
              e,
            ) => +e.value,
          ),
          image = new ImageData(
            new Uint8ClampedArray(base.data),
            preview.width,
            preview.height,
          ),
          gray = values[3] / 255;
        for (let i = 0; i < image.data.length; i += 4) {
          const light =
            (Math.max(base.data[i], base.data[i + 1], base.data[i + 2]) +
              Math.min(base.data[i], base.data[i + 1], base.data[i + 2])) /
            2;
          for (let k = 0; k < 3; k++)
            image.data[i + k] =
              base.data[i + k] * (1 - gray) + light * gray + values[k];
        }
        ctx.putImageData(image, 0, 0);
      }
      channels.forEach(
        /* @function mz-dialogs.callback.44 — Provides the callback for channels for each. Inputs: input; i. Updates: input oninput; sliders at i oninput. */ (
          input,
          i,
        ) => {
          input.oninput =
            /* @function mz-dialogs.oninput.45 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: sliders at i value. Uses: repaint. */ () => {
              sliders[i].value = input.value;
              repaint();
            };
          sliders[i].oninput =
            /* @function mz-dialogs.oninput.46 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: input value. Uses: repaint. */ () => {
              input.value = sliders[i].value;
              repaint();
            };
        },
      );
      const normal = document.createElement("button");
      normal.type = "button";
      normal.textContent = "Normal";
      normal.onclick =
        /* @function mz-dialogs.onclick.47 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: channels for each; repaint. */ () => {
          channels.forEach(
            /* @function mz-dialogs.callback.48 — Provides the callback for channels for each. Inputs: e; i. Updates: e value; sliders at i value. */ (
              e,
              i,
            ) => {
              e.value = 0;
              sliders[i].value = 0;
            },
          );
          repaint();
        };
      colors.append(normal);
      const pending = document.createElement("p");
      pending.className = "mzStatus";
      pending.textContent =
        "Dark, Sepia, Sunset and Night preset values still need native verification.";
      colors.append(pending);
      repaint();
      const frames = field(
          group(body, "Duration"),
          "Frames (1/60 sec)",
          number("mzToneFrames", p[1], 1, 999),
        ),
        wait = document.createElement("input");
      wait.type = "checkbox";
      wait.id = "mzToneWait";
      wait.checked = p[2];
      field(body, "Wait for Completion", wait);
      return /* @function mz-dialogs.callback.49 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: channels map. Returns: a record containing parameters. */ () => ({
        parameters: [
          channels.map(
            /* @function mz-dialogs.callback.50 — Returns + e value. Inputs: e. Returns: + e value. */ (
              e,
            ) => +e.value,
          ),
          +frames.value,
          wait.checked,
        ],
      });
    },
  );
  register(
    225,
    /* @function mz-dialogs.callback.51 — Provides the callback for register. Inputs: body; c. Updates: wait type; wait id; wait checked. Uses: group; field; number; document create element. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [5, 5, 60, true],
        settings = group(body, "Shake"),
        power = field(settings, "Power", number("mzShakePower", p[0], 1, 9)),
        speed = field(settings, "Speed", number("mzShakeSpeed", p[1], 1, 9)),
        frames = field(
          group(body, "Duration"),
          "Frames",
          number("mzShakeFrames", p[2], 1, 999),
        ),
        wait = document.createElement("input");
      wait.type = "checkbox";
      wait.id = "mzShakeWait";
      wait.checked = p[3];
      field(body, "Wait for Completion", wait);
      return /* @function mz-dialogs.callback.52 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+power.value, +speed.value, +frames.value, wait.checked],
      });
    },
  );
  register(
    224,
    /* @function mz-dialogs.callback.53 — Provides the callback for register. Inputs: body; c. Updates: preview style height; wait type; wait checked; wait id. Uses: group; a list of "Red", "Green", "Blue", "Intensity" map; document create element; preview set attribute. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [[255, 255, 255, 170], 60, true],
        colors = group(body, "Color"),
        channels = ["Red", "Green", "Blue", "Intensity"].map(
          /* @function mz-dialogs.callback.54 — Returns field using colors, name, number using "mzFlash" plus name, p at 0 at i, 0. Inputs: name; i. Uses: field; number. Returns: field using colors, name, number using "mzFlash" plus name, p at 0 at i, 0. */ (
            name,
            i,
          ) => field(colors, name, number("mzFlash" + name, p[0][i], 0, 255)),
        ),
        preview = document.createElement("div");
      preview.style.height = "48px";
      preview.setAttribute("aria-label", "Flash color preview");
      colors.append(preview);
      const repaint =
        /* @function mz-dialogs.repaint.55 — Handles repaint within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: preview style background. Uses: channels slice using 0, 3 map using a callback join; channels slice using 0, 3 map; channels slice. */ () => {
          preview.style.background =
            "rgba(" +
            channels
              .slice(0, 3)
              .map(
                /* @function mz-dialogs.callback.56 — Returns + e value. Inputs: e. Returns: + e value. */ (
                  e,
                ) => +e.value,
              )
              .join(",") +
            "," +
            +channels[3].value / 255 +
            ")";
        };
      channels.forEach(
        /* @function mz-dialogs.callback.57 — Returns assignment. Inputs: e. Updates: e oninput. Returns: assignment. */ (
          e,
        ) => (e.oninput = repaint),
      );
      repaint();
      const duration = field(
          group(body, "Duration"),
          "Frames",
          number("mzFlashFrames", p[1], 1, 999),
        ),
        wait = document.createElement("input");
      wait.type = "checkbox";
      wait.checked = p[2];
      wait.id = "mzFlashWait";
      field(body, "Wait for Completion", wait);
      return /* @function mz-dialogs.callback.58 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: channels map. Returns: a record containing parameters. */ () => ({
        parameters: [
          channels.map(
            /* @function mz-dialogs.callback.59 — Returns + e value. Inputs: e. Returns: + e value. */ (
              e,
            ) => +e.value,
          ),
          +duration.value,
          wait.checked,
        ],
      });
    },
  );
  register(
    230,
    /* @function mz-dialogs.callback.60 — Provides the callback for register. Inputs: body; c. Uses: field; number. Returns: a callback. */ (
      body,
      c,
    ) => {
      const frames = field(
        body,
        "Duration (frames)",
        number("mzWaitFrames", c?.parameters[0] ?? 60, 1, 999),
      );
      return /* @function mz-dialogs.callback.61 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+frames.value],
      });
    },
  );
  register(
    111,
    /* @function mz-dialogs.callback.62 — Provides the callback for register. Inputs: body; c. Updates: type onchange; advanced type; advanced text content; advanced id; native condition type. Uses: field; select; document create element; body append. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [0, 1, 0];
      const type = field(
        body,
        "Condition",
        select(
          "mzBranchType",
          [
            [0, "Switch"],
            [1, "Variable"],
            [2, "Self Switch"],
            [3, "Timer"],
            [4, "Actor in party"],
            [7, "Gold"],
            [8, "Item possessed"],
          ],
          p[0],
        ),
      );
      const controls = document.createElement("section");
      body.append(controls);
      let read;
      /* @function mz-dialogs.rebuild.63 — Handles rebuild within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: read. Uses: controls replace children; field; number; select. */ function rebuild() {
        controls.replaceChildren();
        const t = +type.value;
        if (t === 0) {
          const id = field(
              controls,
              "Switch",
              number("mzBranchSwitch", p[0] === 0 ? p[1] : 1, 1, 5000),
            ),
            op = field(
              controls,
              "State",
              select(
                "mzBranchSwitchState",
                [
                  [0, "ON"],
                  [1, "OFF"],
                ],
                p[0] === 0 ? p[2] : 0,
              ),
            );
          read =
            /* @function mz-dialogs.read.64 — Returns a list of 0, + id value, + op value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 0, + id value, + op value. */ () => [
              0,
              +id.value,
              +op.value,
            ];
        } else if (t === 1) {
          const id = field(
              controls,
              "Variable",
              number("mzBranchVariable", p[0] === 1 ? p[1] : 1, 1, 5000),
            ),
            operand = field(
              controls,
              "Operand",
              select(
                "mzBranchOperand",
                [
                  [0, "Constant"],
                  [1, "Variable"],
                ],
                p[0] === 1 ? p[2] : 0,
              ),
            ),
            n = field(
              controls,
              "Value / variable ID",
              number("mzBranchValue", p[0] === 1 ? p[3] : 0),
            ),
            op = field(
              controls,
              "Comparison",
              select(
                "mzBranchComparison",
                [
                  [0, "="],
                  [1, "≥"],
                  [2, "≤"],
                  [3, ">"],
                  [4, "<"],
                  [5, "≠"],
                ],
                p[0] === 1 ? p[4] : 0,
              ),
            );
          read =
            /* @function mz-dialogs.read.65 — Returns a list of 1, + id value, + operand value, + n value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, + id value, + operand value, + n value. */ () => [
              1,
              +id.value,
              +operand.value,
              +n.value,
              +op.value,
            ];
        } else if (t === 2) {
          const id = field(
              controls,
              "Self Switch",
              select(
                "mzBranchSelfSwitch",
                ["A", "B", "C", "D"].map(
                  /* @function mz-dialogs.callback.66 — Returns a list of x, x. Inputs: x. Returns: a list of x, x. */ (
                    x,
                  ) => [x, x],
                ),
                p[0] === 2 ? p[1] : "A",
              ),
            ),
            op = field(
              controls,
              "State",
              select(
                "mzBranchSelfState",
                [
                  [0, "ON"],
                  [1, "OFF"],
                ],
                p[0] === 2 ? p[2] : 0,
              ),
            );
          read =
            /* @function mz-dialogs.read.67 — Returns a list of 2, id value, + op value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 2, id value, + op value. */ () => [
              2,
              id.value,
              +op.value,
            ];
        } else if (t === 3) {
          const seconds = field(
              controls,
              "Seconds",
              number("mzBranchTimerSeconds", p[0] === 3 ? p[1] : 0, 0, 5999),
            ),
            comparison = field(
              controls,
              "Comparison",
              select(
                "mzBranchTimerComparison",
                [
                  [0, "Greater than or equal to"],
                  [1, "Less than or equal to"],
                ],
                p[0] === 3 ? p[2] : 0,
              ),
            );
          read =
            /* @function mz-dialogs.read.68 — Returns a list of 3, + seconds value, + comparison value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 3, + seconds value, + comparison value. */ () => [
              3,
              +seconds.value,
              +comparison.value,
            ];
        } else if (t === 7) {
          const amount = field(
              controls,
              "Gold",
              number("mzBranchGold", p[0] === 7 ? p[1] : 0, 0, 99999999),
            ),
            op = field(
              controls,
              "Comparison",
              select(
                "mzBranchGoldComparison",
                [
                  [0, "Greater than or equal to"],
                  [1, "Less than or equal to"],
                  [2, "Less than"],
                ],
                p[0] === 7 ? p[2] : 0,
              ),
            );
          read =
            /* @function mz-dialogs.read.69 — Returns a list of 7, + amount value, + op value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 7, + amount value, + op value. */ () => [
              7,
              +amount.value,
              +op.value,
            ];
        } else {
          const id = field(
            controls,
            t === 4 ? "Actor" : "Item",
            number("mzBranchDatabaseId", p[0] === t ? p[1] : 1, 1, 5000),
          );
          read =
            /* @function mz-dialogs.read.70 — Returns t equals 4 selects a list of 4, + id value, 0 or a list of 8, + id value. Inputs: no explicit arguments; uses enclosing module state. Returns: t equals 4 selects a list of 4, + id value, 0 or a list of 8, + id value. */ () =>
              t === 4 ? [4, +id.value, 0] : [8, +id.value];
        }
      }
      type.onchange = rebuild;
      rebuild();
      let expression = c?.expression ? structuredClone(c.expression) : null;
      const advanced = document.createElement("button");
      advanced.type = "button";
      advanced.textContent = "Advanced condition…";
      advanced.id = "mzAdvancedBranch";
      const nativeCondition = document.createElement("button");
      nativeCondition.type = "button";
      nativeCondition.textContent = "Use MZ condition";
      nativeCondition.id = "mzUseNativeCondition";
      nativeCondition.onclick =
        /* @function mz-dialogs.onclick.71 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: expression. Uses: sync expression. */ () => {
          expression = null;
          syncExpression();
        };
      const notice = document.createElement("p");
      /* @function mz-dialogs.syncExpression.72 — Handles sync expression within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: native condition disabled; type disabled; notice text content. Uses: controls query selector all using "input,select" for each; controls query selector all. */ function syncExpression() {
        nativeCondition.disabled = !expression;
        type.disabled = !!expression;
        controls
          .querySelectorAll("input,select")
          .forEach(
            /* @function mz-dialogs.callback.73 — Returns assignment. Inputs: e. Updates: e disabled. Returns: assignment. */ (
              e,
            ) => (e.disabled = !!expression),
          );
        notice.textContent = expression
          ? "This branch uses an advanced expression. MZ condition fields are inactive."
          : "";
      }
      advanced.onclick =
        /* @function mz-dialogs.onclick.74 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: baseline; notice text content. Uses: root frontier mzcommands lower; read; root frontier condition editor open. Returns: without a result. */ () => {
          let baseline;
          try {
            baseline =
              expression ||
              root.FrontierMZCommands.lower([
                { type: "mz", code: 111, indent: 0, parameters: read() },
              ])[0].condition.expression;
          } catch (error) {
            notice.textContent = error.message;
            return;
          }
          root.FrontierConditionEditor.open(
            baseline,
            /* @function mz-dialogs.callback.75 — Provides the callback for root frontier condition editor open. Inputs: value. Updates: expression. Uses: sync expression. */ (
              value,
            ) => {
              expression = value;
              syncExpression();
            },
          );
        };
      body.append(advanced, nativeCondition, notice);
      syncExpression();
      const otherwise = document.createElement("input");
      otherwise.type = "checkbox";
      otherwise.id = "mzBranchElse";
      otherwise.checked = !!c?.createElse;
      field(body, "Create Else Branch", otherwise);
      return /* @function mz-dialogs.callback.76 — Returns a record containing parameters, expression, createElse. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone; read. Returns: a record containing parameters, expression, createElse. */ () => ({
        parameters: expression ? structuredClone(p) : read(),
        expression,
        createElse: otherwise.checked,
      });
    },
  );
  register(
    129,
    /* @function mz-dialogs.callback.77 — Provides the callback for register. Inputs: body; c. Updates: initialize type; initialize id; initialize checked; info text content. Uses: field; number; select; document create element. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [1, 0, false],
        actor = field(body, "Actor ID", number("mzPartyActor", p[0], 1, 5000)),
        operation = field(
          body,
          "Operation",
          select(
            "mzPartyOperation",
            [
              [0, "Add"],
              [1, "Remove"],
            ],
            p[1],
          ),
        ),
        initialize = document.createElement("input");
      initialize.type = "checkbox";
      initialize.id = "mzPartyInitialize";
      initialize.checked = p[2];
      field(body, "Initialize — actor database pending", initialize);
      const info = document.createElement("p");
      info.textContent =
        "Initialize is preserved for imported commands but execution reports unsupported until actor database support is available.";
      body.append(info);
      return /* @function mz-dialogs.callback.78 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+actor.value, +operation.value, initialize.checked],
      });
    },
  );
  register(
    124,
    /* @function mz-dialogs.callback.79 — Provides the callback for register. Inputs: body; c. Updates: operation onchange. Uses: field; select; group; number. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [0, 0],
        operation = field(
          body,
          "Operation",
          select(
            "mzTimerOperation",
            [
              [0, "Start"],
              [1, "Stop"],
            ],
            p[0],
          ),
        ),
        time = group(body, "Time"),
        minutes = field(
          time,
          "Minutes",
          number("mzTimerMinutes", Math.floor(p[1] / 60), 0, 99),
        ),
        seconds = field(
          time,
          "Seconds",
          number("mzTimerSeconds", p[1] % 60, 0, 59),
        );
      /* @function mz-dialogs.refresh.80 — Handles refresh within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: minutes disabled; seconds disabled. */ function refresh() {
        minutes.disabled = seconds.disabled = operation.value === "1";
      }
      operation.onchange = refresh;
      refresh();
      return /* @function mz-dialogs.callback.81 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+operation.value, +minutes.value * 60 + +seconds.value],
      });
    },
  );
  for (const code of [118, 119])
    register(
      code,
      /* @function mz-dialogs.callback.82 — Provides the callback for register. Inputs: body; c. Updates: input id; input value; input max length. Uses: document create element; field. Returns: a callback. */ (
        body,
        c,
      ) => {
        const input = document.createElement("input");
        input.id = "mzLabelName";
        input.value = c?.parameters[0] || "";
        input.maxLength = 1000;
        field(body, "Label Name", input);
        return /* @function mz-dialogs.callback.83 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
          parameters: [input.value],
        });
      },
    );
  register(
    205,
    /* @function mz-dialogs.callback.84 — Provides the callback for register. Inputs: body; c. Updates: edit type; edit id; edit text content; target onchange; edit onclick. Uses: frontier mzroutes defaults; field; select; number. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [
          0,
          { ...FrontierMZRoutes.defaults(), repeat: false, wait: true },
        ],
        target = field(
          body,
          "Character",
          select(
            "mzRouteTargetType",
            [
              [-1, "Player"],
              [0, "This Event"],
              [1, "Event ID"],
            ],
            p[0] > 0 ? 1 : p[0],
          ),
        ),
        id = field(
          body,
          "Event ID",
          number("mzRouteTargetId", p[0] > 0 ? p[0] : 1, 1, 5000),
        );
      let route = FrontierMZRoutes.validate(p[1]);
      const summary = document.createElement("p"),
        edit = document.createElement("button");
      edit.type = "button";
      edit.id = "mzEditForcedRoute";
      edit.textContent = "Movement Route…";
      /* @function mz-dialogs.refresh.85 — Handles refresh within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: id disabled; summary text content. */ function refresh() {
        id.disabled = +target.value <= 0;
        summary.textContent =
          route.list.length -
          1 +
          " commands · " +
          (route.repeat ? "Repeat · " : "") +
          (route.wait ? "Wait for completion" : "Continue immediately");
      }
      target.onchange = refresh;
      edit.onclick =
        /* @function mz-dialogs.onclick.86 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzroute dialog open. Returns: frontier mzroute dialog open using route, a callback, a record containing forced. */ () =>
          FrontierMZRouteDialog.open(
            route,
            /* @function mz-dialogs.callback.87 — Provides the callback for frontier mzroute dialog open. Inputs: value. Updates: route. Uses: refresh. */ (
              value,
            ) => {
              route = value;
              refresh();
            },
            { forced: true },
          );
      body.append(summary, edit);
      refresh();
      return /* @function mz-dialogs.callback.88 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+target.value > 0 ? +id.value : +target.value, route],
      });
    },
  );
  register(
    102,
    /* @function mz-dialogs.callback.89 — Provides the callback for register. Inputs: body; c. Updates: input id; input value; input max length. Uses: group; document create element; inputs push; field. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [["Yes", "No"], 1, 0, 2, 0],
        choices = group(body, "Choices"),
        inputs = [];
      for (let i = 0; i < 6; i++) {
        const input = document.createElement("input");
        input.id = "mzChoice" + i;
        input.value = p[0][i] || "";
        input.maxLength = 1000;
        inputs.push(field(choices, String(i + 1), input));
      }
      const settings = group(body, "Settings"),
        defaultChoice = field(
          settings,
          "Default",
          select(
            "mzChoiceDefault",
            [
              [-1, "None"],
              ...Array.from(
                { length: 6 },
                /* @function mz-dialogs.callback.90 — Returns a list of i, "Choice " plus i plus 1. Inputs: ; i. Returns: a list of i, "Choice " plus i plus 1. */ (
                  _,
                  i,
                ) => [i, "Choice " + (i + 1)],
              ),
            ],
            p[2],
          ),
        ),
        cancel = field(
          settings,
          "Cancel",
          select(
            "mzChoiceCancel",
            [
              [-1, "Disallow"],
              [-2, "Branch"],
              ...Array.from(
                { length: 6 },
                /* @function mz-dialogs.callback.91 — Returns a list of i, "Choice " plus i plus 1. Inputs: ; i. Returns: a list of i, "Choice " plus i plus 1. */ (
                  _,
                  i,
                ) => [i, "Choice " + (i + 1)],
              ),
            ],
            p[1],
          ),
        ),
        background = field(
          settings,
          "Background",
          select(
            "mzChoiceBackground",
            [
              [0, "Window"],
              [1, "Dim"],
              [2, "Transparent"],
            ],
            p[4],
          ),
        ),
        position = field(
          settings,
          "Window Position",
          select(
            "mzChoicePosition",
            [
              [0, "Left"],
              [1, "Middle"],
              [2, "Right"],
            ],
            p[3],
          ),
        );
      return /* @function mz-dialogs.callback.92 — Provides the callback for the enclosing mz dialogs operation. Inputs: no explicit arguments; uses enclosing module state. Uses: inputs map; labels at; labels pop; labels some. Returns: a record containing parameters. */ () => {
        const labels = inputs.map(
          /* @function mz-dialogs.callback.93 — Returns i value. Inputs: i. Returns: i value. */ (
            i,
          ) => i.value,
        );
        while (labels.length && !labels.at(-1)) labels.pop();
        if (
          !labels.length ||
          labels.some(
            /* @function mz-dialogs.callback.94 — Returns the inverse of s. Inputs: s. Returns: the inverse of s. */ (
              s,
            ) => !s,
          )
        )
          throw Error("Choices must be filled consecutively.");
        return {
          parameters: [
            labels,
            +cancel.value,
            +defaultChoice.value,
            +position.value,
            +background.value,
          ],
        };
      };
    },
  );
  register(
    103,
    /* @function mz-dialogs.callback.95 — Provides the callback for register. Inputs: body; c. Uses: field; number. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [1, 1],
        variable = field(
          body,
          "Variable",
          number("mzNumberVariable", p[0], 1, 5000),
        ),
        digits = field(body, "Digits", number("mzNumberDigits", p[1], 1, 8));
      return /* @function mz-dialogs.callback.96 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+variable.value, +digits.value],
      });
    },
  );
  register(
    126,
    /* @function mz-dialogs.callback.97 — Provides the callback for register. Inputs: body; c. Updates: operand onchange. Uses: field; number; group; select. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [1, 0, 0, 1],
        item = field(
          body,
          "Item ID — database picker pending",
          number("mzItemId", p[0], 1, 5000),
        ),
        operation = field(
          group(body, "Operation"),
          "Operation",
          select(
            "mzItemOperation",
            [
              [0, "Increase"],
              [1, "Decrease"],
            ],
            p[1],
          ),
        ),
        operand = field(
          group(body, "Operand"),
          "Operand",
          select(
            "mzItemOperand",
            [
              [0, "Constant"],
              [1, "Variable"],
            ],
            p[2],
          ),
        ),
        value = field(
          body,
          p[2] === 1 ? "Variable ID" : "Amount",
          number(
            "mzItemValue",
            p[3],
            p[2] === 1 ? 1 : 0,
            p[2] === 1 ? 5000 : 99999999,
          ),
        );
      operand.onchange =
        /* @function mz-dialogs.onchange.98 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: value min; value max; value parent element first child text content. */ () => {
          value.min = operand.value === "1" ? 1 : 0;
          value.max = operand.value === "1" ? 5000 : 99999999;
          value.parentElement.firstChild.textContent =
            operand.value === "1" ? "Variable ID" : "Amount";
        };
      return /* @function mz-dialogs.callback.99 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [
          +item.value,
          +operation.value,
          +operand.value,
          +value.value,
        ],
      });
    },
  );
  register(
    125,
    /* @function mz-dialogs.callback.100 — Provides the callback for register. Inputs: body; c. Updates: operand onchange. Uses: field; group; select; number. Returns: a callback. */ (
      body,
      c,
    ) => {
      const p = c?.parameters || [0, 0, 1],
        operation = field(
          group(body, "Operation"),
          "Operation",
          select(
            "mzGoldOperation",
            [
              [0, "Increase"],
              [1, "Decrease"],
            ],
            p[0],
          ),
        ),
        operand = field(
          group(body, "Operand"),
          "Operand",
          select(
            "mzGoldOperand",
            [
              [0, "Constant"],
              [1, "Variable"],
            ],
            p[1],
          ),
        ),
        value = field(
          body,
          p[1] === 1 ? "Variable ID" : "Amount",
          number(
            "mzGoldValue",
            p[2],
            p[1] === 1 ? 1 : 0,
            p[1] === 1 ? 5000 : 99999999,
          ),
        );
      operand.onchange =
        /* @function mz-dialogs.onchange.101 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: value min; value max; value parent element first child text content. */ () => {
          value.min = operand.value === "1" ? 1 : 0;
          value.max = operand.value === "1" ? 5000 : 99999999;
          value.parentElement.firstChild.textContent =
            operand.value === "1" ? "Variable ID" : "Amount";
        };
      return /* @function mz-dialogs.callback.102 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+operation.value, +operand.value, +value.value],
      });
    },
  );
  // Map identities come from the current project, never from a cached global list.
  register(
    201,
    /* @function mz-dialogs.callback.103 — Provides the callback for register. Inputs: body; c; context. Updates: designation onchange; notice text content. Uses: field; select; group; rebuild. Returns: a callback. */ (
      body,
      c,
      context,
    ) => {
      const p = c?.parameters || [0, 1, 1, 1, 0, 0],
        designation = field(
          body,
          "Designation",
          select(
            "mzTransferDesignation",
            [
              [0, "Direct"],
              [1, "Variables"],
            ],
            p[0],
          ),
        ),
        destination = group(body, "Destination"),
        maps = context.maps || [];
      let read;
      /* @function mz-dialogs.rebuild.104 — Handles rebuild within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: x step; y step; read. Uses: destination replace children; destination append; object assign; document create element. */ function rebuild() {
        destination.replaceChildren();
        destination.append(
          Object.assign(document.createElement("legend"), {
            textContent: "Destination",
          }),
        );
        if (+designation.value === 0) {
          const choices = maps.map(
            /* @function mz-dialogs.callback.105 — Returns a list of m mz id, string using m mz id pad start using 3, "0" plus ": " plus m name. Inputs: m. Uses: string using m mz id pad start; string. Returns: a list of m mz id, string using m mz id pad start using 3, "0" plus ": " plus m name. */ (
              m,
            ) => [m.mzId, String(m.mzId).padStart(3, "0") + ": " + m.name],
          );
          if (
            !choices.some(
              /* @function mz-dialogs.callback.106 — Returns id equals p at 1. Inputs: array pattern. Returns: id equals p at 1. */ ([
                id,
              ]) => id === p[1],
            )
          )
            choices.push([p[1], "Map " + p[1] + " — unavailable"]);
          const map = field(
              destination,
              "Map",
              select("mzTransferMap", choices, p[1]),
            ),
            x = field(
              destination,
              "X",
              number("mzTransferX", p[0] === 0 ? p[2] : 1, 0, 999999),
            ),
            y = field(
              destination,
              "Y",
              number("mzTransferY", p[0] === 0 ? p[3] : 1, 0, 999999),
            );
          x.step = y.step = "any";
          read =
            /* @function mz-dialogs.read.107 — Returns a list of 0, + map value, + x value, + y value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 0, + map value, + x value, + y value. */ () => [
              0,
              +map.value,
              +x.value,
              +y.value,
            ];
        } else {
          const map = field(
              destination,
              "Map ID variable",
              number("mzTransferMapVariable", p[0] === 1 ? p[1] : 1, 1, 5000),
            ),
            x = field(
              destination,
              "X variable",
              number("mzTransferXVariable", p[0] === 1 ? p[2] : 1, 1, 5000),
            ),
            y = field(
              destination,
              "Y variable",
              number("mzTransferYVariable", p[0] === 1 ? p[3] : 1, 1, 5000),
            );
          read =
            /* @function mz-dialogs.read.108 — Returns a list of 1, + map value, + x value, + y value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, + map value, + x value, + y value. */ () => [
              1,
              +map.value,
              +x.value,
              +y.value,
            ];
        }
      }
      designation.onchange = rebuild;
      rebuild();
      const direction = field(
          body,
          "Direction",
          select(
            "mzTransferDirection",
            [
              [0, "Retain"],
              [2, "Down"],
              [4, "Left"],
              [6, "Right"],
              [8, "Up"],
            ],
            p[4],
          ),
        ),
        fade = field(
          body,
          "Fade",
          select(
            "mzTransferFade",
            [
              [0, "Black"],
              [1, "White"],
              [2, "None"],
            ],
            p[5],
          ),
        );
      const notice = document.createElement("p");
      notice.textContent =
        "Continuous map coordinates are supported. Parallel-event transfers are pending; use a main event trigger.";
      body.append(notice);
      return /* @function mz-dialogs.callback.109 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: read. Returns: a record containing parameters. */ () => ({
        parameters: [...read(), +direction.value, +fade.value],
      });
    },
  );
  register(
    211,
    /* @function mz-dialogs.callback.110 — Provides the callback for register. Inputs: body; c. Uses: field; select. Returns: a callback. */ (
      body,
      c,
    ) => {
      const value = field(
        body,
        "Transparency",
        select(
          "mzPlayerTransparency",
          [
            [0, "ON"],
            [1, "OFF"],
          ],
          c?.parameters?.[0] ?? 0,
        ),
      );
      return /* @function mz-dialogs.callback.111 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters. */ () => ({
        parameters: [+value.value],
      });
    },
  );
  root.FrontierMZDialogs = {
    register,
    open,
    has: /* @function mz-dialogs.has.112 — Returns builders has using code. Inputs: code. Uses: builders has. Returns: builders has using code. */ (
      code,
    ) => builders.has(code),
  };
})(window);
