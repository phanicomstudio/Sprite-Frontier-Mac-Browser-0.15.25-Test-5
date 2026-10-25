/* Isolated movement-route draft; command-specific parameter controls. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-route-dialog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzroute dialog. */
(/* @function mz-route-dialog.installReviewed — Installs isolated movement-route draft authoring with command-specific controls. Validation/owner acceptance decides commitment; registration does not move any runtime actor. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* @function mz-route-dialog.open.2 — Handles open within mz route dialog. Inputs: initial; accept; assignment pattern. Updates: d class name; d id; d style max width; body style display; body style grid template columns. Uses: frontier mzroutes validate; frontier mzroutes defaults; el; d append. */ function open(
    initial,
    accept,
    { forced = false } = {},
  ) {
    let route = FrontierMZRoutes.validate(
        initial || FrontierMZRoutes.defaults(),
      ),
      selected = 0,
      clipboard = [];
    const el =
        /* @function mz-route-dialog.el.3 — Handles el within mz route dialog. Inputs: tag; text. Updates: n text content. Uses: document create element. Returns: n. */ (
          tag,
          text,
        ) => {
          const n = document.createElement(tag);
          if (text) n.textContent = text;
          return n;
        },
      button =
        /* @function mz-route-dialog.button.4 — Handles button within mz route dialog. Inputs: text; fn. Updates: n type; n onclick. Uses: el. Returns: n. */ (
          text,
          fn,
        ) => {
          const n = el("button", text);
          n.type = "button";
          n.onclick = fn;
          return n;
        };
    const d = el("dialog");
    d.className = "mzDialog";
    d.id = "mzRouteDialog";
    d.style.maxWidth = "1000px";
    d.append(el("header", "Movement Route"));
    const body = el("section");
    body.style.display = "grid";
    body.style.gridTemplateColumns = "1fr 2fr";
    const list = el("div");
    list.tabIndex = 0;
    list.setAttribute("aria-label", "Movement commands");
    const palette = el("div");
    palette.style.display = "grid";
    palette.style.gridTemplateColumns = "repeat(3,1fr)";
    body.append(list, palette);
    d.append(body);
    const options = {};
    for (const [key, label] of [
      ["repeat", "Repeat Movements"],
      ["skippable", "Skip If Cannot Move"],
      ["wait", "Wait for Completion"],
    ]) {
      const l = el("label", label),
        n = el("input");
      n.type = "checkbox";
      n.checked = route[key];
      n.onchange =
        /* @function mz-route-dialog.onchange.5 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: route at key. Returns: assignment. */ () =>
          (route[key] = n.checked);
      n.disabled = key === "wait" && !forced;
      l.prepend(n);
      d.append(l);
      options[key] = n;
    }
    d.append(
      el("p", "Jump, image, blend mode and Script execution remain pending."),
    );
    /* @function mz-route-dialog.refresh.6 — Handles refresh within mz route dialog. Inputs: no explicit arguments; uses enclosing module state. Uses: list replace children; route list for each. */ function refresh() {
      list.replaceChildren();
      route.list.forEach(
        /* @function mz-route-dialog.callback.7 — Provides the callback for route list for each. Inputs: c; i. Updates: row style display; row style width; row ondblclick. Uses: button; c parameters join; row set attribute; string. */ (
          c,
          i,
        ) => {
          const row = button(
            "◆ " +
              FrontierMZRoutes.names[c.code] +
              (c.parameters.length
                ? " : " +
                  (c.code === 44
                    ? (c.parameters[0].name || "(None)") +
                      " · " +
                      c.parameters[0].volume +
                      "% · pitch " +
                      c.parameters[0].pitch +
                      "% · pan " +
                      c.parameters[0].pan
                    : c.parameters.join(", "))
                : ""),
            /* @function mz-route-dialog.callback.8 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: selected. Uses: refresh; list focus. */ () => {
              selected = i;
              refresh();
              list.focus();
            },
          );
          row.style.display = "block";
          row.style.width = "100%";
          row.setAttribute("aria-selected", String(i === selected));
          row.ondblclick =
            /* @function mz-route-dialog.ondblclick.9 — Returns parameters using c code, c parameters, a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: parameters. Returns: parameters using c code, c parameters, a callback. */ () =>
              parameters(
                c.code,
                c.parameters,
                /* @function mz-route-dialog.callback.10 — Provides the callback for parameters. Inputs: p. Updates: route list at i. Uses: refresh. */ (
                  p,
                ) => {
                  route.list[i] = { ...c, parameters: p };
                  refresh();
                },
              );
          list.append(row);
        },
      );
    }
    /* @function mz-route-dialog.parameters.11 — Handles parameters within mz route dialog. Inputs: code; values; done. Updates: modal class name; input type; input min; input max; input step. Uses: frontier mzdialogs open; structured clone; a list of 15, 27, 28, 29 includes; done. Returns: without a result; without a result. */ function parameters(
      code,
      values,
      done,
    ) {
      if (code === 44) {
        FrontierMZDialogs.open(
          250,
          {
            type: "mz",
            code: 250,
            indent: 0,
            parameters: values.length
              ? structuredClone(values)
              : [{ name: "", volume: 90, pitch: 100, pan: 0 }],
          },
          /* @function mz-route-dialog.callback.12 — Returns done using record parameters. Inputs: record. Uses: done. Returns: done using record parameters. */ (
            record,
          ) => done(record.parameters),
        );
        return;
      }
      if (![15, 27, 28, 29, 30, 42].includes(code)) {
        done([]);
        return;
      }
      const modal = el("dialog");
      modal.className = "mzDialog";
      modal.setAttribute("aria-label", FrontierMZRoutes.names[code]);
      modal.append(el("header", FrontierMZRoutes.names[code]));
      const label = el(
          "label",
          code === 15
            ? "Duration (frames)"
            : code === 27 || code === 28
              ? "Switch ID"
              : code === 29
                ? "Speed"
                : code === 42
                  ? "Opacity"
                  : "Frequency",
        ),
        input = el(code === 29 || code === 30 ? "select" : "input");
      if (input.tagName === "SELECT") {
        const names =
          code === 29
            ? [
                "×8 Slower",
                "×4 Slower",
                "×2 Slower",
                "Normal",
                "×2 Faster",
                "×4 Faster",
              ]
            : ["Lowest", "Lower", "Normal", "Higher", "Highest"];
        names.forEach(
          /* @function mz-route-dialog.callback.13 — Returns input append using a new option. Inputs: name; i. Uses: input append. Returns: input append using a new option. */ (
            name,
            i,
          ) => input.append(new Option(i + 1 + ": " + name, i + 1)),
        );
      } else {
        input.type = "number";
        input.min = code === 42 ? 0 : 1;
        input.max = code === 42 ? 255 : code === 15 ? 999 : 5000;
        input.step = 1;
      }
      input.value =
        values[0] ??
        (code === 42
          ? 255
          : code === 15
            ? 60
            : code === 29 || code === 30
              ? 3
              : 1);
      label.append(input);
      modal.append(label);
      const status = el("p");
      modal.append(
        status,
        button(
          "OK",
          /* @function mz-route-dialog.callback.14 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: frontier mzroutes validate; frontier mzroutes defaults; done; modal close. */ () => {
            try {
              const p = [+input.value];
              FrontierMZRoutes.validate({
                ...FrontierMZRoutes.defaults(),
                list: [
                  { code, parameters: p },
                  { code: 0, parameters: [] },
                ],
              });
              done(p);
              modal.close();
            } catch (e) {
              status.textContent = e.message;
            }
          },
        ),
        button(
          "Cancel",
          /* @function mz-route-dialog.callback.15 — Returns modal close using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal close. Returns: modal close using . */ () =>
            modal.close(),
        ),
      );
      modal.onclose =
        /* @function mz-route-dialog.onclose.16 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: modal remove. Returns: modal remove using . */ () =>
          modal.remove();
      document.body.append(modal);
      modal.showModal();
      input.focus();
    }
    for (let code = 1; code <= 45; code++) {
      const b = button(
        FrontierMZRoutes.names[code],
        /* @function mz-route-dialog.callback.17 — Returns parameters using code, a list of , a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: parameters. Returns: parameters using code, a list of , a callback. */ () =>
          parameters(
            code,
            [],
            /* @function mz-route-dialog.callback.18 — Provides the callback for parameters. Inputs: p. Uses: route list splice; refresh. */ (
              p,
            ) => {
              route.list.splice(selected, 0, { code, parameters: p });
              selected++;
              refresh();
            },
          ),
      );
      b.disabled = !FrontierMZRoutes.supported(code);
      palette.append(b);
    }
    list.onkeydown =
      /* @function mz-route-dialog.onkeydown.19 — Handles onkeydown within mz route dialog. Inputs: e. Updates: selected; clipboard. Uses: e prevent default; refresh; route list splice; a list of "c", "x", "v" includes. */ (
        e,
      ) => {
        const command = route.list[selected];
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          selected = Math.max(
            0,
            Math.min(
              route.list.length - 1,
              selected + (e.key === "ArrowDown" ? 1 : -1),
            ),
          );
          refresh();
        } else if (e.key === "Delete" && command.code !== 0) {
          e.preventDefault();
          route.list.splice(selected, 1);
          refresh();
        } else if (
          (e.ctrlKey || e.metaKey) &&
          ["c", "x", "v"].includes(e.key.toLowerCase())
        ) {
          e.preventDefault();
          const k = e.key.toLowerCase();
          if (k === "v") {
            route.list.splice(selected, 0, ...structuredClone(clipboard));
            refresh();
          } else if (command.code !== 0) {
            clipboard = [structuredClone(command)];
            if (k === "x") {
              route.list.splice(selected, 1);
              refresh();
            }
          }
        }
      };
    d.append(
      button(
        "OK",
        /* @function mz-route-dialog.callback.20 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: accept; frontier mzroutes validate; d close. */ () => {
          accept(FrontierMZRoutes.validate(route));
          d.close();
        },
      ),
      button(
        "Cancel",
        /* @function mz-route-dialog.callback.21 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */ () =>
          d.close(),
      ),
    );
    d.onclose =
      /* @function mz-route-dialog.onclose.22 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */ () =>
        d.remove();
    document.body.append(d);
    refresh();
    d.showModal();
    list.focus();
  }
  root.FrontierMZRouteDialog = { open };
})(window);
