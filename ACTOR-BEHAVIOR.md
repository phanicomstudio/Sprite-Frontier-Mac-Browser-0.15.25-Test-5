# Actor exploration behavior

In the event editor, expand Sprite Frontier properties and playtest, then choose Configure wander / patrol / sentinel. The profile belongs to the selected page and overrides Autonomous Movement. Cancel discards the dialog draft; Use this behavior edits the event draft; Apply commits it. Use Autonomous Movement instead removes the profile from the draft.

Sentinel holds position. Wander chooses destinations within its home radius. Patrol cycles through up to 64 absolute X, Y waypoints. Optional player approach acquires within detection distance, pursues until target distance or home distance exceeds its limit, and returns home before resuming idle behavior. Speed is world units per second. Home is the event's position when this page controller starts. Page changes initialize a new controller. Forced movement routes take precedence.

Movement sweeps short segments against map bounds and collision. Long frames are capped at 0.25 seconds of movement; this favors bounded work over catching up after a stall. This is direct steering, not pathfinding. A blocked patrol waits at the obstacle; wander chooses another destination. Debug phase history holds at most 16 transitions per controller.

Implementation: actor-behavior.js owns validation and movement; event-schema.js preserves page profiles and extensions; events.js dispatches isolated session movement; behavior-dialog.js owns the private editor draft. Profiles are additive optional data within event schema version 2; existing events retain their prior movement behavior.

Verified: patrol movement, detection/chase/return followed by patrol resumption, stationary sentinel, wander radius, swept collision, invalid data, extension preservation and isolated event-session movement. The full 66-fixture cached source suite passed. Windows Chrome dialog checks cover Cancel, waypoint entry, approach, draft isolation, Apply and cancellation after Apply.

Patrol waypoints now validate against their map dimensions. Behavior snapshots capture original home, phase, waypoint index and wander destination in map-local journey state. Runtime restoration validates the controller before installing it; older saves without snapshots start new controllers. Source JSON snapshot tests prove home preservation and resumed return. The browser courier journey/save regression still passes.

Whole-save validation now matches snapshots against effective event pages, including template replacements, before project adoption. Windows Chrome verifies original home restoration through playtest export/import and rejection of an invalid page snapshot while retaining the active world. The cached source suite passes after these changes.

Combat event actors now use the behavior controller's chase phase for aggression and suppress legacy combat pursuit while the profile owns movement. Their target comes from the shared party/enemy policy; dead actors do not move. Combat attacks remain in the existing combat loop. Source checks cover chase combat activation, return suppression and death. The browser behavior/save regression passes after integration.

Stun and attack cooldowns now advance once before event movement, regardless of acquisition state. Stunned behavior actors pause movement; idle and returning enemies can recover. Source checks cover recovery without aggression and invalid elapsed time. The browser save regression still passes.

Live Windows Chrome testing now verifies an event enemy's patrol, acquisition, repeated combat damage, stun movement pause/recovery, return suppression of aggression and resumed patrol. This caught and corrected a cooldown dispatch missing from ordinary exploration. The test installs validated authored event data in the example town and runs the normal frame loop; it does not establish map mouse authoring coverage.

Still required: combined browser behavior travel/return verification; replacement-specific browser save coverage; a user-accessible authored encounter including party combat and live map interaction. This does not yet establish complete NPC/enemy behavior acceptance.
