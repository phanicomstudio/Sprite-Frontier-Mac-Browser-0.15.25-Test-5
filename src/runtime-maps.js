/* October 12, 2026: exported-game map ownership. Unlike the editor library,
 * this service does not install demo cells, build controls or use IndexedDB.
 * Gameplay saves retain their existing project snapshot shape. The caller owns
 * HUD, scene initialization and compact per-cell playtest state. */
(/* @function runtimeMaps.install — Inputs: browser global. Returns nothing; installs the runtime-only map factory. Does not start a game or access persistence. */ function (
  root,
) {
  "use strict";
  /* @function runtimeMaps.create — Inputs: scene API with replace(world, options), and exported project data. Returns a map service with no authoring operations. Validates all maps/models before installation; malformed exports throw. World coordinates and transfer options are passed unchanged to the scene owner. */
  function create(api, exported) {
    let project = root.FrontierMaps.validate(
        exported ?? root.FRONTIER_EXPORTED_PROJECT,
      ),
      bank = null;
    root.FrontierModelLibrary.restore(project.models);
    /* @function runtimeMaps.get — Inputs: stable map ID. Returns owned authored map record or undefined. Gameplay reads its world for transition preparation; callers must not edit that record. No scene or storage effects. */
    function get(id) {
      for (const map of project.maps) if (map.id === id) return map;
    }
    /* @function runtimeMaps.snapshot — Inputs: none. Returns a detached portable project copy. Gameplay state remains separately owned by the existing save system; no authored data is overwritten by runtime entity positions. */
    function snapshot() {
      return structuredClone(project);
    }
    /* @function runtimeMaps.switchTo — Inputs: map ID and existing transfer options (arrival in world metres, yaw radians, shared gameplay state). Returns nothing. Rejects unknown maps before mutation; selects and replaces the scene using a detached world. A scene-owner failure restores the previous active ID and propagates. */
    function switchTo(id, options) {
      const map = get(id);
      if (!map) throw Error("Unknown runtime map: " + id);
      const prior = project.active;
      project.active = id;
      try {
        api.replace(structuredClone(map.world), options);
      } catch (error) {
        project.active = prior;
        throw error;
      }
    }
    /* @function runtimeMaps.restore — Inputs: saved portable project. Returns nothing. Validates and installs its model bundles before replacing owned project data, invalidates compiled event templates, then restores its active scene. Errors propagate to the existing save UI. No editor library or local project database is touched. */
    function restore(value) {
      const checked = root.FrontierMaps.validate(value);
      root.FrontierModelLibrary.restore(checked.models);
      project = checked;
      bank = null;
      switchTo(project.active);
    }
    /* @function runtimeMaps.load — Inputs: none. Returns nothing. Starts the exported active cell directly; does not consult the editor's browser profile or append test maps. Scene-owner exceptions propagate. */
    function load() {
      switchTo(project.active);
    }
    /* @function runtimeMaps.remember — Inputs: none. Returns nothing. Compatibility hook for shared gameplay call sites; runtime does not autosave authored projects. Explicit gameplay Save retains responsibility for persistence. */
    function remember() {}
    /* @function runtimeMaps.gameplayDefaults — Inputs: none. Returns detached initial gameplay settings, preventing runtime mutations from changing exported defaults. No persistence effects. */
    function gameplayDefaults() {
      return structuredClone(project.gameplayDefaults);
    }
    /* @function runtimeMaps.templateBank — Inputs: none. Returns lazily compiled event definitions shared for this project. Invalidated only after restore; missing/invalid template compilation errors propagate. */
    function templateBank() {
      if (!bank) bank = root.FrontierEventTemplates.compile(project.templates);
      return bank;
    }
    /* @function runtimeMaps.getByNumber — Inputs: authored numeric map identity. Returns resolved map record or undefined according to the existing identity service. Does not change scenes. */
    function getByNumber(number) {
      return root.FrontierMapIdentities.resolve(project.maps, number);
    }
    return {
      get,
      snapshot,
      switchTo,
      restore,
      load,
      remember,
      templateBank,
      getByNumber,
      get gameplayDefaults /* @function runtimeMaps.defaultSettings — Inputs: none. Returns detached initial gameplay settings through the coordinator's established property contract. No mutations or storage effects. */() {
        return gameplayDefaults();
      },
      get active /* @function runtimeMaps.active — Inputs: none. Returns current runtime cell ID; read-only and independent of editor selection. */() {
        return project.active;
      },
    };
  }
  root.FrontierRuntimeMaps = { create };
})(window);
