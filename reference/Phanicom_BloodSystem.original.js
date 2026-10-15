/*:
 * @target MZ
 * @plugindesc v1.0.1 Unified blood identity, original spray physics and frame-correct passive drips.
 * @author Phanicom
 *
 * @help
 * Phanicom_BloodSystem.js v1.0.1 - consolidated from your six plugins.
 * v1.0.1 clears transient sprays/drips on every load/new game, including
 * same-map loads. Saved actor identities and passive hiding are unchanged.
 * With Phanicom_ActiveCombat v0.9.0, load this BELOW ActiveCombat.
 * 
 * INSTALL / MIGRATE
 * 1. Back up your game and save files. Copy this file into js/plugins unchanged.
 * 2. DISABLE all six old plugins in Plugin Manager:
 *    BleedEffect.js, cream_bleed_effect.js, blood_spray_plugin.js,
 *    cream_blood_spray.js, cream_blood_spray_override.js,
 *    synth_blood_enhanced_archive.js.
 *    Also disable renamed copies (BloodSpray / SynthBloodSprayEnhanced).
 * 3. Enable Phanicom_BloodSystem below your character-frame / @8D_ plugins and
 *    other plugins that alias actor gainHp. Only one blood plugin must be active.
 *    Other plugins must preserve aliases; an outright replacement below this
 *    plugin can bypass its hooks. No ABS plugin is required.
 * 4. Re-enter any customized settings here; old parameters are NOT imported.
 *    The supplied files read BloodSpray / SynthBloodSprayEnhanced instead of
 *    their actual filenames, so some old editor settings were never applied.
 * 5. Test on a map. Existing saves initialize new settings lazily. New games
 *    start at notetag defaults. No edits to actors, HP, database notes or ABS.
 * 
 * BLOOD IDENTITY / SAVE DATA
 * Actor runtime override > current actor <CreamBleed> note > regular.
 * The note is read afresh, without relying on stale metadata. Add <CreamBleed>
 * to an actor's database note for default cream blood. Default removes the
 * override. Player means current party leader; follower index 1 means the
 * first follower (NOT party index 0). Changes belong to the actor and follow
 * that actor through party reordering. A missing actor/follower returns false.
 * Overrides and passive hiding are stored in Game_System and saved normally.
 * 
 * PLUGIN COMMANDS
 * Set Actor / Player / Follower Blood Type: Regular, Cream, or Default.
 * Reset Blood Types: removes ALL actor overrides; does not change hiding.
 * Hide / Show Passive Bleeding: immediately hides existing passive drops and
 * stops new passive drops/audio; damage and manual sprays continue normally.
 * Use Hide on vehicle entry / cutscene start; Show on exit / end. Hiding stays
 * in effect across transfers and saves until Show is called.
 * <NoBleedEffect> in a MAP note suppresses passive dripping on that map only.
 * Show cannot override this map tag. Neither option changes HP or identity.
 * Spray Event: event 0 means the command's own interpreter event, including
 * parallel events; enter regular, cream, none, or a #RGB/#RRGGBB blood value.
 * 
 * SCRIPT CALLS
 * PhanicomBlood.setActorType(1, "cream");
 * PhanicomBlood.setPlayerType("regular");
 * PhanicomBlood.setFollowerType(1, "default");
 * PhanicomBlood.getActorType(1); // effective string, or null for missing ID
 * PhanicomBlood.resetBloodTypes();
 * PhanicomBlood.hideBleeding();
 * PhanicomBlood.showBleeding();
 * PhanicomBlood.isBleedingVisible(); // global/map permission, not HP check
 * All setters also accept "none", "synth" (cream alias), or "#76ff32".
 * Use "default" to resume the actor's current notetag, not to force red.
 * 
 * PUBLIC EFFECT API / FUTURE ABS INTEGRATION
 * PhanicomBlood.resolve($gameActors.actor(1));
 * PhanicomBlood.resolve($gamePlayer);
 * PhanicomBlood.resolve("cream");
 * Returns a fresh descriptor: type, enabled, profile, color, dripColor,
 * particleCount, duration, yOffset. Accepts Game_Actor, player/follower, or
 * identity string. A bare "default" resolves to regular without an actor.
 * Custom hex blood uses regular physics unless profile:"cream" is supplied.
 * 
 * PhanicomBlood.sprayActor(1); // visible map representative, uses identity
 * PhanicomBlood.sprayCharacter($gamePlayer); // uses actor identity
 * PhanicomBlood.sprayEvent(5, {blood:"cream", count:18, spraySize:2.5});
 * PhanicomBlood.sprayAt(10, 8, {blood:"#76ff32", count:12, duration:45});
 * PhanicomBlood.sprayPixels(500, 400, {blood:"cream", spraySize:4});
 * PhanicomBlood.sprayAt(10, 8, {blood:"#E6F3FF", profile:"cream"});
 * PhanicomBlood.clearSprays(); // manual/damage particles only
 * 
 * sprayAt uses MAP TILE coordinates, adds a half-tile center and yOffset.
 * sprayPixels uses MAP WORLD PIXELS exactly as passed; no centering/offset.
 * Camera translation remains the original world minus displayX/Y formula.
 * Character/event helpers use character.x/y tile positions as in the sources.
 * Options: blood (identity or actor), profile (regular/cream), color (hex),
 * count (0..10000), duration (base frames), yOffset (pixels), spraySize
 * (0.01..100, cream only). Omitted options use the resolved profile defaults.
 * Explicit blood or color takes precedence over the actor for that call only.
 * none always suppresses emission, even if color/profile is also specified.
 * Effect calls return the emitted count; invalid/missing events, off-map
 * scenes and none return 0. Invalid identities/options throw clear errors.
 * 
 * ABS should resolve its own enemy's blood string or the actor and call an
 * effect helper where it already handles hit/death/gib/fracture events.
 * This plugin does not parse ABS enemy tags, create gibs, intercept deaths,
 * or assume ABS internals. There is ONE gainHp alias and NO HP polling.
 * Auto spray uses actual HP loss, only for living, visible party characters
 * on the map. Direct setHp/_hp writes do not trigger it. Lethal damage is
 * left to explicit death/gib calls, matching the sources' living-only rule.
 * If a future ABS emits actor hit sprays itself, disable Auto Spray here
 * to avoid emitting both an ABS spray and the automatic gainHp spray.
 * 
 * VISUAL PRESERVATION / INTENTIONAL CONSOLIDATION
 * Regular particles retain +/-4 velocity, .1 gravity, .98 horizontal drag,
 * 2..5 pixel size, randomized life/fade and .95 shrink after 70% life.
 * Cream uses the enhanced synth formulas, viscosity, vertical drag, sqrt
 * size/gravity scaling, pulsing glow and outer glow above spray size 3.
 * Cream damage emits ONE enhanced spray, replacing the overlapping red and
 * cream detectors. Default damage count stays 8 from the final override;
 * raise Cream Damage Count to 15 to use the archive's auto-count setting.
 * Cream is consistently #F5F5DC rather than the override's #f5fd5c yellow.
 * The original solid main pixels remain solid; opacity governs disappearance
 * and glow. This is deliberately not a new alpha-fading particle design.
 * Old duration arguments were ignored. Legacy sprayBloodAt still ignores
 * its duration argument; NEW API duration works. Base defaults 30/35 retain
 * the actual original lifetimes, plus original random/synth life additions.
 * Passive drips retain 3 square 4px drops, 5..24-frame intervals, speed 4,
 * opacity loss 3/frame, lifetime 60, and X offset -5 with +/-10 variation.
 * Only the origin calculation changes: actual Sprite_Character frame height,
 * 30% above its bottom, including anchors and MZ bush splitting. No bitmap
 * sheet division or @8D_ special case. Requires the 8-direction plugin to
 * set the rendered frame correctly. Original drops were lifetime-removed,
 * not clipped at the feet; that behavior is retained.
 * Red drip sound keeps the synthesized squelch. Cream sound defaults OFF:
 * the old cream override could not access the closure-local audio object.
 * Enable Cream Drip Sound to use the same squelch. No external assets needed.
 * 
 * LEGACY SCRIPT COMPATIBILITY (final source definitions)
 * sprayBloodFromEvent(id, offset=-200, count=12, color=regular)
 * sprayBloodFromCurrentEvent(offset=-200, count=12, color=regular)
 * sprayBloodFromPlayer(offset=-200, count=12, color=regular)
 * sprayBloodAt(x, y, count, ignoredDuration, color, offset=Regular Tile Offset)
 * spraySynthBloodFromEvent(id, offset, count, color, spraySize)
 * spraySynthBloodFromCurrentEvent(offset, count, color, spraySize)
 * spraySynthBloodFromPlayer(offset, count, color, spraySize)
 * spraySynthBloodAt(x, y, offset, count, color, spraySize)
 * Synth omissions use cream parameters. Legacy regular calls default to
 * regular; use PhanicomBlood.sprayCharacter for automatic actor identity.
 * Dark/Bright/BlueSynth/GreenSynth and Massive/Huge/LargeSynth helpers remain.
 * Dark/Bright helpers now correctly forward their color/count (the source
 * called an obsolete signature). Old CurrentEvent wrappers use the main map
 * interpreter only; in parallel/common events use Spray Event command or
 * PhanicomBlood.sprayEvent(this.eventId(), {...}) in an event script.
 * Private $bloodSprayManager/$synthBloodSprayManager internals and old debug
 * test/forceEnable/simulate helpers are not exported. Migrate such calls to
 * PhanicomBlood. Do not load any old plugin alongside this one.
 * 
 * PARAMETERS
 * Offsets are independent: legacy Event/Player wrappers keep -200; the
 * Regular Tile Offset default 0 matches sprayBloodAt. Damage Offset defaults
 * to -200, with Cream Damage Boost -20 from the final cream override.
 * Damage duration uses the profile Base Life rather than the old unused
 * autoSprayDuration values. All timing uses update frames (normally 60/sec).
 * Viscosity is velocity retention per frame: smaller means stronger damping.
 * Spray Size affects cream spread, gravity, life and glow; Particle Size
 * affects cream droplet size. No new particle art or physics are introduced.
 * Rendering keeps the original non-loop-aware camera conversion; wrapping
 * map seams and unusual camera plugins require testing in your project.
 * 
 *
 * @param regularColor
 * @text Regular Spray Color
 * @desc Hex #RGB or #RRGGBB; regular spray only.
 * @type string
 * @default #CC0000
 *
 * @param creamColor
 * @text Cream / Synth Color
 * @desc Unified cream color for both spray and passive drips.
 * @type string
 * @default #F5F5DC
 *
 * @param dripColor
 * @text Regular Drip Color
 * @desc Original bright-red passive drip color.
 * @type string
 * @default #FF0000
 *
 * @param regularCount
 * @text Regular Manual Count
 * @desc Default manual regular particles.
 * @type number
 * @min 0
 * @default 12
 *
 * @param creamCount
 * @text Cream Manual Count
 * @desc Default manual enhanced synth particles.
 * @type number
 * @min 0
 * @default 18
 *
 * @param regularDuration
 * @text Regular Base Life
 * @desc Frames plus original random 0..15; preserves effective source lifetime.
 * @type number
 * @min 0
 * @default 30
 *
 * @param creamDuration
 * @text Cream Base Life
 * @desc Frames plus random 0..15 and 1.5 x spray size.
 * @type number
 * @min 0
 * @default 35
 *
 * @param regularFade
 * @text Regular Fade Rate
 * @desc Opacity loss/frame after half-life, plus random 0..0.02.
 * @type string
 * @default 0.05
 *
 * @param creamFade
 * @text Cream Fade Rate
 * @desc Opacity loss/frame after half-life, plus random 0..0.02.
 * @type string
 * @default 0.05
 *
 * @param regularOffset
 * @text Regular Tile Offset
 * @desc Pixels for API regular sprayAt and legacy sprayBloodAt.
 * @type number
 * @min -10000
 * @default 0
 *
 * @param creamOffset
 * @text Cream Manual Offset
 * @desc Pixels above tile center for manual cream sprays.
 * @type number
 * @min -10000
 * @default -200
 *
 * @param damageOffset
 * @text Damage Spray Offset
 * @desc Pixels above tile center for automatic actor damage.
 * @type number
 * @min -10000
 * @default -200
 *
 * @param creamBoost
 * @text Cream Damage Boost
 * @desc Extra vertical pixels added to Damage Spray Offset for cream.
 * @type number
 * @min -10000
 * @default -20
 *
 * @param autoSpray
 * @text Auto Spray on Damage
 * @desc One spray per gainHp HP loss; map only, living visible actors.
 * @type boolean
 * @default true
 *
 * @param damageCount
 * @text Regular Damage Count
 * @desc Particle count per regular damage spray.
 * @type number
 * @min 0
 * @default 8
 *
 * @param creamDamageCount
 * @text Cream Damage Count
 * @desc Final override count; set 15 for enhanced archive auto-count.
 * @type number
 * @min 0
 * @default 8
 *
 * @param spraySize
 * @text Cream Spray Size
 * @desc 0.01..100. Enhanced synth spread/velocity/gravity/life/glow multiplier.
 * @type string
 * @default 1.0
 *
 * @param particleSize
 * @text Cream Particle Size
 * @desc 0.01..100. Enhanced synth individual droplet size multiplier.
 * @type string
 * @default 1.0
 *
 * @param viscosity
 * @text Cream Viscosity
 * @desc 0.1..1. Velocity retained per frame; lower is thicker/slower.
 * @type string
 * @default 0.98
 *
 * @param glow
 * @text Cream Glow
 * @desc Original pulsing glow and outer layer above spray size 3.
 * @type boolean
 * @default true
 *
 * @param hpThreshold
 * @text Passive Bleed HP Threshold
 * @desc Absolute HP, inclusive. Original also drips at 0 HP.
 * @type number
 * @min 0
 * @default 10
 *
 * @param dripSound
 * @text Passive Drip Sound
 * @desc Original synthesized red squelch; no external assets.
 * @type boolean
 * @default true
 *
 * @param creamDripSound
 * @text Cream Drip Sound
 * @desc Opt in to sound; original cream override was silent.
 * @type boolean
 * @default false

 * @command SetActorBloodType
 * @text Set Actor Blood Type
 * @desc Save a blood override on the chosen actor. Default removes it.
 * @arg actorId
 * @text Actor
 * @type actor
 * @default 1
 * @arg type
 * @text Blood Type
 * @type select
 * @option Regular
 * @value regular
 * @option Cream
 * @value cream
 * @option Default (Actor Notetag)
 * @value default
 * @default default

 * @command SetPlayerBloodType
 * @text Set Player Blood Type
 * @desc Applies to the current leader actor, and follows that actor.
 * @arg type
 * @text Blood Type
 * @type select
 * @option Regular
 * @value regular
 * @option Cream
 * @value cream
 * @option Default (Actor Notetag)
 * @value default
 * @default default

 * @command SetFollowerBloodType
 * @text Set Follower Blood Type
 * @desc Applies to the actor currently represented by this follower.
 * @arg followerIndex
 * @text Follower Index (1 = first)
 * @type number
 * @min 1
 * @default 1
 * @arg type
 * @text Blood Type
 * @type select
 * @option Regular
 * @value regular
 * @option Cream
 * @value cream
 * @option Default (Actor Notetag)
 * @value default
 * @default default

 * @command ResetBloodTypes
 * @text Reset Blood Types
 * @desc Clear all saved actor overrides; restore notetag defaults.

 * @command HideBleeding
 * @text Hide Passive Bleeding
 * @desc Hide existing passive drops and stop new drops/audio; sprays continue.

 * @command ShowBleeding
 * @text Show Passive Bleeding
 * @desc Allow passive drips again, unless map has <NoBleedEffect>.

 * @command SprayEvent
 * @text Spray Event
 * @desc Manual spray; event 0 uses the calling event, including parallel events.
 * @arg eventId
 * @text Event ID (0 = this event)
 * @type number
 * @min 0
 * @default 0
 * @arg blood
 * @text Blood Identity or Hex
 * @type string
 * @default regular
 * @arg count
 * @text Particle Count
 * @type number
 * @min 0
 * @max 10000
 * @default 12
 * @arg yOffset
 * @text Y Offset (pixels)
 * @type number
 * @min -10000
 * @default -200
 * @arg spraySize
 * @text Cream Spray Size
 * @type string
 * @default 1.0
 */
(() => {
    'use strict';
    const NAME = 'Phanicom_BloodSystem';
    const p = PluginManager.parameters(NAME);
    const num = (key, fallback, min = -Infinity, max = Infinity) => {
        const n = p[key] === undefined || p[key] === '' ? fallback : Number(p[key]);
        return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    };
    function hex(value) {
        if (typeof value !== 'string') return null;
        const s = value.trim();
        if (/^#[\da-f]{6}$/i.test(s)) return s.toUpperCase();
        if (/^#[\da-f]{3}$/i.test(s)) return '#' + [...s.slice(1)].map(c => c + c).join('').toUpperCase();
        return null;
    }
    const cfg = {
        regularColor: hex(p.regularColor) || '#CC0000',
        creamColor: hex(p.creamColor) || '#F5F5DC',
        dripColor: hex(p.dripColor) || '#FF0000',
        regularCount: num('regularCount', 12, 0, 10000),
        creamCount: num('creamCount', 18, 0, 10000),
        regularDuration: num('regularDuration', 30, 1),
        creamDuration: num('creamDuration', 35, 1),
        regularFade: num('regularFade', 0.05, 0, 1),
        creamFade: num('creamFade', 0.05, 0, 1),
        regularOffset: num('regularOffset', 0),
        creamOffset: num('creamOffset', -200),
        damageOffset: num('damageOffset', -200),
        creamBoost: num('creamBoost', -20),
        autoSpray: p.autoSpray !== 'false',
        damageCount: num('damageCount', 8, 0, 10000),
        creamDamageCount: num('creamDamageCount', 8, 0, 10000),
        spraySize: num('spraySize', 1, 0.01, 100),
        particleSize: num('particleSize', 1, 0.01, 100),
        viscosity: num('viscosity', 0.98, 0.1, 1),
        glow: p.glow !== 'false',
        hpThreshold: num('hpThreshold', 10, 0),
        dripSound: p.dripSound !== 'false',
        creamDripSound: p.creamDripSound === 'true'
    };

    // Save only plain data on Game_System. Lazy initialization supports old saves;
    // nothing is cached across new games or loads. No database notes are mutated.
    function state() {
        if (!$gameSystem) return null;
        if (!$gameSystem._phanicomBlood) {
            $gameSystem._phanicomBlood = { version: 1, actors: {}, hidden: false };
        }
        return $gameSystem._phanicomBlood;
    }
    function actorFor(character) {
        if (character instanceof Game_Player) return $gameParty?.leader() || null;
        if (character instanceof Game_Follower) return character.actor() || null;
        return null;
    }
    function follower(index) {
        return Number.isInteger(Number(index)) && Number(index) >= 1
            ? $gamePlayer?.followers().follower(Number(index) - 1) : null;
    }
    function normalize(type) {
        if (typeof type !== 'string') return null;
        const s = type.trim().toLowerCase();
        if (s === 'synth') return 'cream';
        return ['regular', 'cream', 'none', 'default'].includes(s) ? s : hex(type);
    }
    function actorType(actor) {
        if (!actor) return 'regular';
        const override = state()?.actors[actor.actorId()];
        if (override && override !== 'default') return override;
        return /<CreamBleed>/i.test(actor.actor()?.note || '') ? 'cream' : 'regular';
    }
    function definition(type) {
        const cream = type === 'cream';
        return {
            type, enabled: type !== 'none', profile: cream ? 'cream' : 'regular',
            color: cream ? cfg.creamColor : (hex(type) || cfg.regularColor),
            dripColor: cream ? cfg.creamColor : (hex(type) || cfg.dripColor),
            particleCount: cream ? cfg.creamCount : cfg.regularCount,
            duration: cream ? cfg.creamDuration : cfg.regularDuration,
            yOffset: cream ? cfg.creamOffset : cfg.regularOffset
        };
    }
    function resolve(subject = 'regular') {
        if (subject instanceof Game_Actor) return definition(actorType(subject));
        const actor = actorFor(subject);
        if (actor) return definition(actorType(actor));
        const type = normalize(subject);
        if (!type) throw new TypeError(NAME + ': blood must be regular, cream, none, default, or a #RGB/#RRGGBB color.');
        return definition(type === 'default' ? 'regular' : type);
    }
    function setActorType(id, type) {
        id = Number(id);
        const normalized = normalize(type);
        if (!Number.isInteger(id) || id < 1 || !$dataActors?.[id] || !normalized || !state()) return false;
        if (normalized === 'default') delete state().actors[id];
        else state().actors[id] = normalized;
        clearDrips();
        return true;
    }
    function onMap() {
        const scene = SceneManager._scene;
        return scene instanceof Scene_Map && !!scene._spriteset && !scene._phanicomBloodTerminated;
    }
    function disposeSprite(sprite) {
        if (!sprite) return;
        if (sprite.parent) sprite.parent.removeChild(sprite);
        const bitmap = sprite.bitmap;
        sprite.bitmap = null;
        if (bitmap) bitmap.destroy();
        sprite.destroy();
    }

    // Particle constructors/update/draw are ported from the supplied sources.
    // Intentional legacy rendering: the main pixel is opaque until removal;
    // opacity drives lifetime and synth glow, not main-pixel paintOpacity.
    const BloodParticle = (() => {
    const bloodColor = cfg.regularColor, defaultDuration = cfg.regularDuration, fadeOutSpeed = cfg.regularFade;
    class BloodParticle {
        constructor(x, y, color = bloodColor, duration = defaultDuration) {
            this.startX = x;
            this.startY = y;
            this.x = x;
            this.y = y;
            this.velocityX = (Math.random() - 0.5) * 8;
            this.velocityY = (Math.random() - 0.5) * 8;
            this.gravity = 0.1;
            this.opacity = 1.0;
            this.life = 0;
            this.maxLife = duration + Math.random() * 15;
            this.size = 2 + Math.random() * 3;
            this.color = color;
            this.fadeSpeed = fadeOutSpeed + Math.random() * 0.02;
        }

        update() {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityY += this.gravity;
            this.velocityX *= 0.98;
            
            this.life++;
            
            if (this.life > this.maxLife * 0.5) {
                this.opacity -= this.fadeSpeed;
                if (this.opacity < 0) this.opacity = 0;
            }
            
            if (this.life > this.maxLife * 0.7) {
                this.size *= 0.95;
            }
        }

        isDead() {
            return this.life >= this.maxLife || this.opacity <= 0;
        }

        draw(sprite) {
            if (this.opacity <= 0) return;
            
            const bitmap = sprite.bitmap;
            // Convert world coordinates to screen coordinates
            const screenX = this.x - $gameMap.displayX() * $gameMap.tileWidth();
            const screenY = this.y - $gameMap.displayY() * $gameMap.tileHeight();
            
            
            bitmap.fillRect(
                screenX - this.size/2, 
                screenY - this.size/2, 
                this.size, 
                this.size, 
                this.color
            );
        }
    }
    return BloodParticle;
    })();
    const SynthBloodParticle = (() => {
    const synthBloodColor = cfg.creamColor, defaultDuration = cfg.creamDuration,
        fadeOutSpeed = cfg.creamFade, spraySize = cfg.spraySize, particleSize = cfg.particleSize,
        viscosity = cfg.viscosity, glowEffect = cfg.glow;
    class SynthBloodParticle {
        constructor(x, y, color = synthBloodColor, customSpraySize = spraySize, duration = defaultDuration) {
            this.startX = x;
            this.startY = y;
            this.x = x;
            this.y = y;
            
            // Base velocity similar to original blood spray but with synth parameters
            const baseVelocityX = 8;
            const baseVelocityY = 8;
            const velocityMultiplier = Math.max(0.5, customSpraySize);
            
            this.velocityX = (Math.random() - 0.5) * baseVelocityX * velocityMultiplier;
            this.velocityY = (Math.random() - 0.5) * baseVelocityY * velocityMultiplier;
            this.gravity = Math.max(0.1, 0.1 * Math.sqrt(customSpraySize));
            this.opacity = 1.0;
            this.life = 0;
            
            // Life similar to original but with some synth enhancement
            this.maxLife = duration + Math.random() * 15 + (customSpraySize * 1.5);
            
            // Base particle size similar to original blood spray
            const baseSize = 2 + Math.random() * 3;
            const sizeMultiplier = particleSize * Math.sqrt(customSpraySize);
            this.size = Math.max(1, baseSize * sizeMultiplier);
            
            this.color = color;
            this.fadeSpeed = fadeOutSpeed + Math.random() * 0.02;
            this.glowing = glowEffect;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.sprayMultiplier = customSpraySize;
        }

        update() {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityY += this.gravity;
            
            // Friction similar to original blood spray but with viscosity parameter
            this.velocityX *= viscosity;
            this.velocityY *= Math.min(0.98, viscosity + 0.01);
            
            this.life++;
            this.pulsePhase += 0.1;
            
            // Fade timing similar to original blood spray
            if (this.life > this.maxLife * 0.5) {
                this.opacity -= this.fadeSpeed;
                if (this.opacity < 0) this.opacity = 0;
            }
            
            // Size reduction timing similar to original
            if (this.life > this.maxLife * 0.7) {
                this.size *= 0.95;
            }
        }

        isDead() {
            return this.life >= this.maxLife || this.opacity <= 0;
        }

        draw(sprite) {
            if (this.opacity <= 0) return;
            
            const bitmap = sprite.bitmap;
            const screenX = this.x - $gameMap.displayX() * $gameMap.tileWidth();
            const screenY = this.y - $gameMap.displayY() * $gameMap.tileHeight();
            
            // Draw main particle
            bitmap.fillRect(
                screenX - this.size/2, 
                screenY - this.size/2, 
                this.size, 
                this.size, 
                this.color
            );
            
            // Enhanced glow effect for synth blood (optional enhancement)
            if (this.glowing && this.opacity > 0.2) {
                const baseGlow = 2 * Math.sqrt(this.sprayMultiplier);
                const pulseGlow = Math.sin(this.pulsePhase) * (1 * Math.sqrt(this.sprayMultiplier));
                const glowSize = this.size + baseGlow + pulseGlow;
                const glowOpacity = Math.floor((this.opacity * 0.3) * 255);
                const glowColor = this.color + ('0' + glowOpacity.toString(16)).slice(-2);
                
                // Multiple glow layers for larger sprays
                if (this.sprayMultiplier > 3) {
                    const outerGlowSize = glowSize * 1.3;
                    const outerGlowOpacity = Math.floor((this.opacity * 0.15) * 255);
                    const outerGlowColor = this.color + ('0' + outerGlowOpacity.toString(16)).slice(-2);
                    
                    bitmap.fillRect(
                        screenX - outerGlowSize/2, 
                        screenY - outerGlowSize/2, 
                        outerGlowSize, 
                        outerGlowSize, 
                        outerGlowColor
                    );
                }
                
                bitmap.fillRect(
                    screenX - glowSize/2, 
                    screenY - glowSize/2, 
                    glowSize, 
                    glowSize, 
                    glowColor
                );
            }
        }
    }
    return SynthBloodParticle;
    })();
    class ABSArcadeAudio {
        constructor() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("AudioContext not available.");
                this.ctx = null;
            }
        }

        createArcadeSound(type, duration, freqStart, freqEnd = 0, volume = 0.3) {
            if (!this.ctx) return;
            const oscillator = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const waveShaper = this.ctx.createWaveShaper();
            const curve = new Float32Array(256);
            for (let i = 0; i < 256; i++) {
                const x = (i - 128) / 128;
                curve[i] = Math.sign(x) * Math.floor(Math.abs(x) * 8) / 8;
            }
            waveShaper.curve = curve;

            oscillator.type = type;
            oscillator.frequency.value = freqStart;
            if (freqEnd > 0) {
                oscillator.frequency.linearRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
            }

            gain.gain.value = volume;
            oscillator.connect(waveShaper);
            waveShaper.connect(gain);
            gain.connect(this.ctx.destination);

            oscillator.start();
            oscillator.stop(this.ctx.currentTime + duration);
        }

        // Softer, wetter squelchy blood drip sound
        playSquelchyDrip() {
            if (!this.ctx) return;
            // Softer base drip sound (triangle wave with gentle pitch drop)
            const dripOsc = this.ctx.createOscillator();
            dripOsc.type = "triangle"; // Softer wave type
            dripOsc.frequency.setValueAtTime(60, this.ctx.currentTime); // Lower start frequency
            dripOsc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.5); // Slower, lower drop
            const dripGain = this.ctx.createGain();
            dripGain.gain.setValueAtTime(0.15, this.ctx.currentTime); // Lower volume
            dripGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.4); // Smoother decay
            dripGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);

            // Wetter squelch effect (longer noise burst with low-pass filter)
            const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseData.length; i++) {
                noiseData[i] = Math.random() * 0.5 - 0.25; // Reduced amplitude for softer noise
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = "lowpass";
            noiseFilter.frequency.setValueAtTime(400, this.ctx.currentTime); // Lower starting frequency
            noiseFilter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.3); // Slower sweep
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime); // Lower amplitude
            noiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

            // Connect and play
            dripOsc.connect(dripGain);
            dripGain.connect(this.ctx.destination);
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            dripOsc.start();
            dripOsc.stop(this.ctx.currentTime + 0.5);
            noise.start();
            noise.stop(this.ctx.currentTime + 0.3);
        }
    }
    let audio = null;
    function playDrip(cream) {
        if (!cfg.dripSound || (cream && !cfg.creamDripSound)) return;
        if (!audio) audio = new ABSArcadeAudio();
        if (audio.ctx?.state === 'suspended') audio.ctx.resume().catch(() => {});
        audio.playSquelchyDrip();
    }

    // One manager, with the original red/synth layers (z=8/9). Reuse bitmaps
    // rather than allocating a full-screen bitmap for every damage event.
    const layers = {
        regular: { particles: [], sprite: null },
        cream: { particles: [], sprite: null }
    };
    function clearSprays() {
        for (const layer of Object.values(layers)) {
            layer.particles.length = 0;
            disposeSprite(layer.sprite);
            layer.sprite = null;
        }
    }
    function ensureLayer(profile) {
        const layer = layers[profile];
        const parent = SceneManager._scene._spriteset;
        if (layer.sprite?.parent !== parent || layer.sprite?.bitmap?.width !== Graphics.width ||
            layer.sprite?.bitmap?.height !== Graphics.height) {
            disposeSprite(layer.sprite);
            layer.sprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
            layer.sprite.z = profile === 'cream' ? 9 : 8;
            parent.addChild(layer.sprite);
        }
        // Spriteset children are not z-sorted. Explicitly keep synth above red.
        if (layers.regular.sprite && layers.cream.sprite) {
            const a = layers.regular.sprite, b = layers.cream.sprite;
            if (parent.getChildIndex(a) > parent.getChildIndex(b)) parent.swapChildren(a, b);
        }
        return layer;
    }
    function finite(value, fallback, min = -Infinity, max = Infinity) {
        if (value === undefined || value === null) return fallback;
        const n = Number(value);
        if (!Number.isFinite(n) || n < min || n > max) throw new RangeError(NAME + ': invalid effect option.');
        return n;
    }
    function sprayPixels(x, y, options = {}) {
        if (!onMap()) return 0;
        x = finite(x, NaN); y = finite(y, NaN);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return 0;
        const blood = resolve(options.blood ?? 'regular');
        if (!blood.enabled) return 0;
        const profile = options.profile ?? blood.profile;
        if (profile !== 'cream' && profile !== 'regular') throw new TypeError(NAME + ': invalid profile.');
        const defaults = definition(profile);
        const color = options.color === undefined ? blood.color : hex(options.color);
        if (!color) throw new TypeError(NAME + ': color must be #RGB or #RRGGBB.');
        const count = Math.floor(finite(options.count, defaults.particleCount, 0, 10000));
        const duration = finite(options.duration, defaults.duration, 1, 100000);
        const size = finite(options.spraySize, cfg.spraySize, 0.01, 100);
        if (!count) return 0;
        const layer = ensureLayer(profile);
        for (let i = 0; i < count; i++) {
            layer.particles.push(profile === 'cream'
                ? new SynthBloodParticle(x, y, color, size, duration)
                : new BloodParticle(x, y, color, duration));
        }
        return count;
    }
    function sprayAt(x, y, options = {}) {
        if (!onMap()) return 0;
        const blood = resolve(options.blood ?? 'regular');
        const offset = finite(options.yOffset,
            options.profile === undefined ? blood.yOffset : definition(options.profile).yOffset);
        return sprayPixels(Number(x) * $gameMap.tileWidth() + $gameMap.tileWidth() / 2,
            Number(y) * $gameMap.tileHeight() + $gameMap.tileHeight() / 2 + offset, options);
    }
    function sprayCharacter(character, options = {}) {
        if (!character) return 0;
        const blood = options.blood ?? actorFor(character) ?? 'regular';
        return sprayAt(character.x, character.y, { ...options, blood });
    }
    function updateSprays() {
        for (const layer of Object.values(layers)) {
            if (!layer.sprite) continue;
            layer.sprite.bitmap.clear();
            for (let i = layer.particles.length - 1; i >= 0; i--) {
                const particle = layer.particles[i];
                particle.update();
                if (particle.isDead()) layer.particles.splice(i, 1);
                else particle.draw(layer.sprite);
            }
            if (!layer.particles.length) {
                disposeSprite(layer.sprite);
                layer.sprite = null;
            }
        }
    }

    function passiveAllowed() {
        return !state()?.hidden && !/<NoBleedEffect>/i.test($dataMap?.note || '');
    }
    function removeDrips(sprite) {
        if (sprite._phanicomDrips) sprite._phanicomDrips.forEach(disposeSprite);
        sprite._phanicomDrips = [];
        sprite._phanicomDripTimer = 0;
        sprite._phanicomDripInterval = null;
        sprite._phanicomDripIdentity = null;
    }
    function clearDrips() {
        for (const sprite of SceneManager._scene?._spriteset?._characterSprites || []) removeDrips(sprite);
    }
    const nextDripInterval = () => 15 + Math.floor(Math.random() * 20) - 10;
    function updateDrips(sprite) {
        const actor = actorFor(sprite._character);
        const blood = actor ? resolve(actor) : null;
        // MZ retains the full height in _frame even while bush splitting sets
        // its width to zero. Read the current frame AFTER the original update.
        const height = sprite._frame?.height || 0;
        if (!actor || actor.hp > cfg.hpThreshold || !passiveAllowed() || !blood.enabled ||
            !sprite.visible || sprite.opacity <= 0 || height <= 0 ||
            !sprite.bitmap || !sprite.bitmap.isReady() ||
            (sprite._character instanceof Game_Follower && !sprite._character.isVisible())) {
            removeDrips(sprite);
            return;
        }
        const identity = actor.actorId() + ':' + blood.type;
        if (sprite._phanicomDripIdentity !== identity) removeDrips(sprite);
        sprite._phanicomDripIdentity = identity;
        if (sprite._phanicomDripInterval === null || sprite._phanicomDripInterval === undefined) {
            sprite._phanicomDripInterval = nextDripInterval();
            sprite._phanicomDripTimer = 0;
            sprite._phanicomDrips = [];
        }
        sprite._phanicomDripTimer++;
        if (sprite._phanicomDripTimer >= sprite._phanicomDripInterval) {
            sprite._phanicomDripTimer = 0;
            sprite._phanicomDripInterval = nextDripInterval();
            // Same 3 x 4px drops, horizontal spread, 30%-up origin and motion.
            // Anchor-aware local coordinates inherit character scale/movement.
            const width = sprite._frame.width || sprite._upperBody?._frame?.width || 0;
            const originX = (0.5 - sprite.anchor.x) * width - 5;
            const originY = (0.7 - sprite.anchor.y) * height;
            for (let i = 0; i < 3; i++) {
                const drip = new Sprite(new Bitmap(4, 4));
                drip.bitmap.fillAll(blood.dripColor);
                drip.x = originX - 10 + Math.random() * 20;
                drip.y = originY;
                drip.opacity = 255;
                drip.lifetime = 60;
                drip.z = 10;
                sprite.addChild(drip);
                sprite._phanicomDrips.push(drip);
            }
            playDrip(blood.type === 'cream');
        }
        for (let i = sprite._phanicomDrips.length - 1; i >= 0; i--) {
            const drip = sprite._phanicomDrips[i];
            drip.y += 4;
            drip.lifetime--;
            drip.opacity -= 3;
            // Original endY was unused: preserve lifetime-based removal.
            if (drip.lifetime <= 0 || drip.opacity <= 0) {
                disposeSprite(drip);
                sprite._phanicomDrips.splice(i, 1);
            }
        }
    }
    const characterUpdate = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        characterUpdate.apply(this, arguments);
        updateDrips(this);
    };
    const characterDestroy = Sprite_Character.prototype.destroy;
    Sprite_Character.prototype.destroy = function() {
        removeDrips(this);
        characterDestroy.apply(this, arguments);
    };

    // Exactly one HP hook: no polling and no deferred timers. Honor the existing
    // alias chain instead of bypassing other plugins through Game_Battler.
    const gainHp = Game_Actor.prototype.gainHp;
    const processingHp = new WeakSet();
    Game_Actor.prototype.gainHp = function(value) {
        if (processingHp.has(this)) return gainHp.apply(this, arguments);
        const before = this.hp;
        processingHp.add(this);
        let result;
        try { result = gainHp.apply(this, arguments); }
        finally { processingHp.delete(this); }
        if (!cfg.autoSpray || this.hp >= before || this.hp <= 0 || !onMap() || $gameParty.inBattle()) return result;
        const character = $gameParty.leader() === this ? $gamePlayer
            : $gamePlayer.followers().visibleFollowers().find(f => f.actor() === this);
        if (!character || character.isTransparent()) return result;
        const blood = resolve(this);
        const cream = blood.type === 'cream';
        sprayCharacter(character, {
            blood: this, count: cream ? cfg.creamDamageCount : cfg.damageCount,
            yOffset: cfg.damageOffset + (cream ? cfg.creamBoost : 0)
        });
        return result;
    };
    const mapUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        mapUpdate.apply(this, arguments);
        updateSprays();
    };
    const mapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        this._phanicomBloodTerminated = false;
        mapStart.apply(this, arguments);
    };
    const mapTerminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        this._phanicomBloodTerminated = true;
        clearSprays(); clearDrips();
        mapTerminate.apply(this, arguments);
    };

    const API = window.PhanicomBlood = {
        version: '1.0.1', resolve, setActorType,
        setPlayerType(type) { const a = $gameParty?.leader(); return !!a && setActorType(a.actorId(), type); },
        setFollowerType(index, type) { const a = follower(index)?.actor(); return !!a && setActorType(a.actorId(), type); },
        getActorType(id) { const a = $dataActors?.[Number(id)] && $gameActors?.actor(Number(id)); return a ? actorType(a) : null; },
        resetBloodTypes() { if (!state()) return false; state().actors = {}; clearDrips(); return true; },
        hideBleeding() { if (!state()) return false; state().hidden = true; clearDrips(); return true; },
        showBleeding() { if (!state()) return false; state().hidden = false; return true; },
        isBleedingVisible: passiveAllowed,
        sprayAt, sprayPixels, sprayCharacter,
        sprayActor(id, options = {}) {
            const a = $dataActors?.[Number(id)] && $gameActors?.actor(Number(id));
            if (!a) return 0;
            const ch = $gameParty.leader() === a ? $gamePlayer
                : $gamePlayer.followers().visibleFollowers().find(f => f.actor() === a);
            return ch ? sprayCharacter(ch, options) : 0;
        },
        sprayEvent(id, options = {}) { return sprayCharacter($gameMap?.event(Number(id)), options); },
        clearSprays
    };
    // Transient renderers must never cross a load/new-game boundary. Clear
    // before extraction while the old scene and its sprites still exist.
    if (typeof DataManager !== 'undefined') {
        for (const name of ['createGameObjects', 'extractSaveContents']) {
            const original = DataManager[name];
            DataManager[name] = function() {
                clearSprays();
                clearDrips();
                return original.apply(this, arguments);
            };
        }
    }
    PluginManager.registerCommand(NAME, 'SetActorBloodType', args => API.setActorType(args.actorId, args.type));
    PluginManager.registerCommand(NAME, 'SetPlayerBloodType', args => API.setPlayerType(args.type));
    PluginManager.registerCommand(NAME, 'SetFollowerBloodType', args => API.setFollowerType(args.followerIndex, args.type));
    PluginManager.registerCommand(NAME, 'ResetBloodTypes', () => API.resetBloodTypes());
    PluginManager.registerCommand(NAME, 'HideBleeding', () => API.hideBleeding());
    PluginManager.registerCommand(NAME, 'ShowBleeding', () => API.showBleeding());
    PluginManager.registerCommand(NAME, 'SprayEvent', function(args) {
        API.sprayEvent(Number(args.eventId) || this.eventId(), {
            blood: args.blood || 'regular', count: Number(args.count), yOffset: Number(args.yOffset),
            spraySize: Number(args.spraySize)
        });
    });

    // Compatibility wrappers use the FINAL definitions in the supplied files,
    // not the obsolete signatures printed in their original help headers.
    const eventId = () => $gameMap?._interpreter?.eventId() || 0;
    const legacyRegular = (offset, count, color) => ({ blood: color ?? 'regular', yOffset: offset, count });
    window.sprayBloodFromEvent = (id, offset = -200, count = 12, color) => API.sprayEvent(id, legacyRegular(offset, count, color));
    window.sprayBloodFromCurrentEvent = (offset = -200, count = 12, color) => window.sprayBloodFromEvent(eventId(), offset, count, color);
    window.sprayBloodFromPlayer = (offset = -200, count = 12, color) => sprayCharacter($gamePlayer, legacyRegular(offset, count, color));
    // Legacy duration was ignored by its constructor; keep that visual timing.
    window.sprayBloodAt = (x, y, count, _duration, color, offset = null) =>
        sprayAt(x, y, { blood: color ?? 'regular', count, yOffset: offset ?? cfg.regularOffset });
    const legacySynth = (offset, count, color, size) => ({
        blood: 'cream', profile: 'cream', color, yOffset: offset, count, spraySize: size
    });
    window.spraySynthBloodFromEvent = (id, offset, count, color, size) => API.sprayEvent(id, legacySynth(offset, count, color, size));
    window.spraySynthBloodFromCurrentEvent = (offset, count, color, size) => window.spraySynthBloodFromEvent(eventId(), offset, count, color, size);
    window.spraySynthBloodFromPlayer = (offset, count, color, size) => sprayCharacter($gamePlayer, legacySynth(offset, count, color, size));
    window.spraySynthBloodAt = (x, y, offset, count, color, size) => sprayAt(x, y, legacySynth(offset, count, color, size));
    window.sprayDarkBlood = (id, count) => API.sprayEvent(id, { blood: '#8B0000', count, yOffset: -200 });
    window.sprayBrightBlood = (id, count) => API.sprayEvent(id, { blood: '#FF0000', count, yOffset: -200 });
    window.sprayBlueSynthBlood = (id, count, size) => window.spraySynthBloodFromEvent(id, undefined, count, '#E6F3FF', size);
    window.sprayGreenSynthBlood = (id, count, size) => window.spraySynthBloodFromEvent(id, undefined, count, '#F0FFF0', size);
    window.sprayMassiveSynthBlood = (id, count = 30) => window.spraySynthBloodFromEvent(id, undefined, count, undefined, 4);
    window.sprayHugeSynthBlood = (id, count = 25) => window.spraySynthBloodFromEvent(id, undefined, count, undefined, 2.5);
    window.sprayLargeSynthBlood = (id, count = 20) => window.spraySynthBloodFromEvent(id, undefined, count, undefined, 1.5);
})();
