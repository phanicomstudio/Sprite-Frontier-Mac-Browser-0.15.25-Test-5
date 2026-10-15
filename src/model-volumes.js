/* Spatial triggers retain transitions in a bounded queue while dialogue owns
 * the main interpreter. Per-session ownership prevents stale map/iteration state. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model volumes. */
(/* @function model-volumes.reviewed1 — Registers spatial enter/exit trigger tracking. Inputs: browser/global root. Returns nothing; installs FrontierModelVolumes with a WeakMap per interpreter session. No world polling or trigger execution occurs at script load. */ function (
  root,
) {
  "use strict";
  const states = new WeakMap();
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.update.2 — Advances this system using the current state and elapsed time. Inputs: game; session. Updates: state; state inside; game model zone debug. Uses: states get; states set; frontier model events contains using host, position map; frontier model events contains. */
  /* @function model-volumes.reviewed2 — Detects spatial-zone transitions and drains pending events. Inputs: live game and interpreter session. Returns nothing; probes player XYZ plus 0.8 m body offset, skips dead/transparent hosts during detection, and tracks zone IDs per session. Queues at most 128 enter/exit records while dialogue owns the interpreter; overflow increments dropped count. When idle, rechecks zone/event/page availability and starts at most one accepted event, updating diagnostics. Does not move player or directly switch cells. */ function update(
    game,
    session,
  ) {
    let state = states.get(session);
    if (!state) {
      state = { inside: new Set(), pending: [], dropped: 0 };
      states.set(session, state);
    }
    const next = new Set();
    for (const host of game.sceneEvents || []) {
      if (host.dead || host.transparent || !host.spatial) continue;
      const position = [
          game.player.x,
          game.player.y,
          (game.player.z || 0) + 0.8,
        ],
        inside = new Set(
          FrontierModelEvents.contains(host, position).map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.callback.3 — Returns b id. Inputs: b. Returns: b id. */
            /* @function model-volumes.reviewed3 — Indexes one containing interaction box. Inputs: box b returned by validated containment. Returns its stable zone ID for membership testing; no mutation or event execution. */ (
              b,
            ) => b.id,
          ),
        );
      for (const box of host.spatial.interactionZones) {
        if (!box.enabled || box.trigger === "interact") continue;
        const key = host.id + ":" + box.id,
          isInside = inside.has(box.id),
          wasInside = state.inside.has(key);
        if (isInside) next.add(key);
        if (
          (box.trigger === "enter" && isInside && !wasInside) ||
          (box.trigger === "exit" && !isInside && wasInside)
        ) {
          if (state.pending.length < 128)
            state.pending.push({
              hostId: host.id,
              zoneId: box.id,
              eventId: box.eventId,
              trigger: box.trigger,
            });
          else state.dropped++;
        }
      }
    }
    state.inside = next;
    if (!session.busy) {
      while (state.pending.length) {
        const entry = state.pending.shift(),
          host = game.sceneEvents.find(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.callback.4 — Returns e id equals entry host id. Inputs: e. Returns: e id equals entry host id. */
            /* @function model-volumes.reviewed4 — Finds the queued trigger host by identity. Inputs: current scene event e, with pending record captured. Returns ID match; no mutation. Missing host makes later zone validation skip the stale queue entry. */ (
              e,
            ) => e.id === entry.hostId,
          ),
          zone = host?.spatial?.interactionZones.find(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.callback.5 — Returns b id equals entry zone id. Inputs: b. Returns: b id equals entry zone id. */
            /* @function model-volumes.reviewed5 — Finds the queued interaction zone. Inputs: host zone b. Returns pending zone-ID match; no mutation. Enabled state is checked separately before dispatch. */ (
              b,
            ) => b.id === entry.zoneId,
          ),
          event = session.events.find(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.callback.6 — Returns e id equals entry event id. Inputs: e. Returns: e id equals entry event id. */
            /* @function model-volumes.reviewed6 — Finds the queued target interpreter event. Inputs: authored event e. Returns pending event-ID match; no page execution or mutation. Missing target causes queued entry to be discarded. */ (
              e,
            ) => e.id === entry.eventId,
          );
        if (!zone?.enabled || !event) continue;
        const page = event.pages[session.activePage(event)];
        if (
          !page ||
          !["interact", "playerTouch", "eventTouch"].includes(page.trigger)
        )
          continue;
        if (session.start(event, page.trigger)) {
          game.modelZoneDebug = {
            ...entry,
            pending: state.pending.length,
            dropped: state.dropped,
          };
          break;
        }
      }
    }
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-volumes.debug.7 — Handles debug within model volumes. Inputs: session. Uses: states get; structured clone. Returns: s selects a record containing inside, pending, dropped or a record containing inside, pending, dropped. */
  /* @function model-volumes.reviewed7 — Reads spatial trigger diagnostics for one session. Inputs: interpreter session. Returns detached inside IDs, pending records and overflow count, or empty defaults when untouched. Does not consume queued events or create session state; WeakMap ownership avoids retained obsolete sessions. */ function debug(
    session,
  ) {
    const s = states.get(session);
    return s
      ? {
          inside: [...s.inside],
          pending: structuredClone(s.pending),
          dropped: s.dropped,
        }
      : { inside: [], pending: [], dropped: 0 };
  }
  root.FrontierModelVolumes = { update, debug };
})(typeof window === "undefined" ? globalThis : window);
