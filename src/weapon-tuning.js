/* Per-weapon angular deviation, stored with authored maps and project saves.
 * Values are Gaussian standard deviations in degrees, not a hard cone limit. */
(/* @function weapon-tuning.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier weapon tuning. */ function(root){'use strict';
 /* @function weapon-tuning.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: array is array; object keys; error; object entries. Returns: result. */ function validate(value={}){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>64)throw Error('Invalid weapon spread settings.');
  const result={};for(const [id,degrees] of Object.entries(value)){
   if(!/^[a-z0-9_-]{1,64}$/i.test(id)||!Number.isFinite(degrees)||degrees<0||degrees>30)throw Error('Weapon spread must be between 0 and 30 degrees.');
   Object.defineProperty(result,id,{value:degrees,enumerable:true,writable:true,configurable:true});
  }return result;
 }
 /* @function weapon-tuning.degrees.3 — Handles degrees within weapon tuning. Inputs: world; weapon. Returns: chain or the fallback weapon id equals "handgun" selects 0.5 or weapon spread radians or 0 multiplied by 180 divided by math pi. */ function degrees(world,weapon){return world?.weaponSpreads?.[weapon.id]??(weapon.id==='handgun'?.5:(weapon.spreadRadians||0)*180/Math.PI);}
 root.FrontierWeaponTuning={validate,degrees,radians:/* @function weapon-tuning.radians.4 — Returns degrees using world, weapon multiplied by math pi divided by 180. Inputs: world; weapon. Uses: degrees. Returns: degrees using world, weapon multiplied by math pi divided by 180. */ (world,weapon)=>degrees(world,weapon)*Math.PI/180};
})(window);

