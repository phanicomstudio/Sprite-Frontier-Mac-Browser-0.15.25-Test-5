/* Named gameplay state commands. Separate from MZ numeric commands so gameplay
 * extensions do not overload MZ operands. Authoring and execution share validation.
 * Numeric changes saturate at the save boundary; collections never grow unbounded. */
(/* @function gameplay-commands.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier gameplay commands. Uses: root frontier event runtime register; object freeze. */ function(root){'use strict';
 const collections={skill:'skills',reputation:'reputation',faction:'factions',quest:'quests',inventory:'inventory'},limit=1000000;
 /* @function gameplay-commands.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: object has own; a list of "set", "add", "remove" includes; error; a list of "skill", "reputation", "inventory" includes. Returns: without a result. */ function validate(c){if(!Object.hasOwn(collections,c.domain)||typeof c.key!=='string'||!c.key||c.key.length>120||!['set','add','remove'].includes(c.operation))throw Error('Invalid gameplay state target or operation.');
  if(c.operation==='remove')return;
  if(['skill','reputation','inventory'].includes(c.domain)){if(!Number.isFinite(c.value)||Math.abs(c.value)>limit)throw Error('Gameplay numeric value must be within ±1,000,000.');if(c.domain==='inventory'&&(!Number.isInteger(c.value)||c.operation==='set'&&c.value<0))throw Error('Inventory needs whole quantities; Set cannot be negative.');}
  else{if(c.operation!=='set')throw Error('Quest and faction values use Set or Remove.');if(c.domain==='faction'?typeof c.value!=='boolean':!(typeof c.value==='boolean'||typeof c.value==='string'&&c.value.length<=120||typeof c.value==='number'&&Number.isFinite(c.value)&&Math.abs(c.value)<=limit))throw Error('Invalid gameplay state value.');}
 }
 /* @function gameplay-commands.execute.3 — Handles execute within gameplay commands. Inputs: c; object pattern. Updates: value. Uses: error; map delete; map get; number is finite. Returns: without a result; without a result. */ function execute(c,{state}){const map=state[collections[c.domain]];if(!(map instanceof Map))throw Error('Gameplay state collection unavailable: '+c.domain);
  if(c.operation==='remove'){map.delete(c.key);return;}
  let value=c.value;if(c.operation==='add'){const previous=map.get(c.key)??0;if(!Number.isFinite(previous))throw Error('Cannot add to a nonnumeric gameplay value.');value=Math.max(-limit,Math.min(limit,previous+c.value));}
  if(c.domain==='inventory'){if(!Number.isInteger(map.get(c.key)??0))throw Error('Existing inventory quantity must be whole.');value=Math.max(0,value);if(!value){map.delete(c.key);return;}}
  if(!map.has(c.key)&&map.size>=2000)throw Error('Gameplay state limit reached; remove an unused key first.');
  map.set(c.key,value);
 }
 root.FrontierEventRuntime.register('gameplayState',{validate,execute});
 root.FrontierGameplayCommands={collections:Object.freeze(collections),validate};
})(typeof window==='undefined'?globalThis:window);

