/* Focused authoring tabs and brush transactions. Existing form IDs remain intact
 * so event and combat tools retain their behavior. Only the active category shows.
 * Brush interpolation fills gaps between pointer events and avoids repeated stamps.
 */
(/* @function editor-tools.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier editor tools. */ function(root){
  'use strict';/* @function editor-tools.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box id; box inner html; ground text content; ground picker id; ground picker onchange. Uses: $ using "sceneTool" closest; $; document create element; ground picker append. Returns: a record containing begin, move, end, refresh, select, active. */ function create(api){
    const $=/* @function editor-tools.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */ id=>document.getElementById(id),host=$('sceneTool').closest('div');
    const box=document.createElement('fieldset');box.id='terrainTools';box.innerHTML='<legend>Terrain brush</legend><label>Brush<select id="brushTool"><option value="raise">Raise</option><option value="lower">Lower</option><option value="flatten">Flatten</option><option value="smooth">Smooth</option><option value="water">Paint water</option><option value="eraseWater">Erase water</option></select></label><label>Size (world units)<input id="brushRadius" type="number" min="1" max="12" value="3"></label><label>Strength<input id="brushStrength" type="number" min="0.05" max="2" step="0.05" value="0.3"></label><label>Flatten height<input id="brushHeight" type="number" min="-30" max="30" step="0.1" value="0"></label><p>Left-drag the surface to paint. Right-drag looks around. One stroke is one undo step.</p>';
    const ground=document.createElement('label');ground.textContent='Ground texture';const groundPicker=document.createElement('select');groundPicker.id='groundMaterial';groundPicker.append(new Option('Vector ground',''),...FrontierOutdoorAssets.assets.filter(/* @function editor-tools.callback.4 — Returns a category equals "ground". Inputs: a. Returns: a category equals "ground". */ a=>a.category==='ground').map(/* @function editor-tools.callback.5 — Returns a new option. Inputs: a. Returns: a new option. */ a=>new Option(a.name,a.id)));ground.append(groundPicker);box.append(ground);groundPicker.onchange=/* @function editor-tools.onchange.6 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.7 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w ground material. Uses: api world. */ ()=>{const w=api.world();if(groundPicker.value)w.groundMaterial=groundPicker.value;else delete w.groundMaterial;});
    $('sceneTool').append(new Option('Terrain / water brush','brush'));$('sceneTool').closest('label').after(box);
    const water=document.createElement('fieldset');water.id='waterMaterial';water.innerHTML='<legend>Water material</legend><label>Surface height for new paint<input id="waterLevel" type="number" min="-30" max="30" step="0.1"></label><label>Texture<select id="waterTexture"><option value="">Animated placeholder</option></select><input id="waterImport" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Color<input id="waterColor" type="color"></label><details><summary>Animation settings</summary>'+[['scale','Texture scale',.25,16],['speed','Warp speed',-5,5],['warp','Warp strength',0,.3],['flowX','Flow X',-2,2],['flowY','Flow Y',-2,2]].map(/* @function editor-tools.callback.8 — Returns "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.01\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.01\"></label>". */ ([k,label,min,max])=>'<label>'+label+'<input id="water-'+k+'" type="number" min="'+min+'" max="'+max+'" step="0.01"></label>').join('')+'</details><details><summary>Underwater camera effect</summary><label><input id="underwaterEnabled" type="checkbox">Enable distortion (no tint)</label>'+[['underwaterStrength','Distortion strength',0,.05],['underwaterSpeed','Distortion speed',-5,5],['underwaterFrequency','Wave count',1,20]].map(/* @function editor-tools.callback.9 — Returns "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.001\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.001\"></label>". */ ([k,label,min,max])=>'<label>'+label+'<input id="water-'+k+'" type="number" min="'+min+'" max="'+max+'" step="0.001"></label>').join('')+'</details><button id="applyWater">Apply water material</button><button id="testPool">Create wading test pool</button><p>Above-water views hide submerged bodies; underwater views reveal them. Shorelines follow terrain. Place assets in img/water. Swimming is deferred.</p>';box.after(water);
    const flight=document.createElement('fieldset');flight.id='flightSettings';flight.innerHTML='<legend>Player movement ability</legend><label>Mode<select id="flightMode"><option value="ground">Ground</option><option value="hover">Hover above terrain</option><option value="flight">Free flight</option></select></label>'+[['height','Hover clearance'],['ascent','Ascent speed'],['descent','Descent speed'],['acceleration','Hover response'],['min','Minimum altitude'],['max','Maximum altitude']].map(/* @function editor-tools.callback.10 — Returns "<label>" plus label plus "<input id=\"flight-" plus k plus "\" type=\"number\" step=\"0.1\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"flight-" plus k plus "\" type=\"number\" step=\"0.1\"></label>". */ ([k,label])=>'<label>'+label+'<input id="flight-'+k+'" type="number" step="0.1"></label>').join('')+'<button id="applyFlight">Apply ability</button><p>Free flight: E ascends, Q descends. Other actors can reuse the same movement profile API.</p>';water.after(flight);
    $('applyWater').onclick=/* @function editor-tools.onclick.11 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.12 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w water. Uses: api world; frontier water validate; $; number. */ ()=>{
      const w=api.world();w.water=FrontierWater.validate({
        ...w.water,underwaterEnabled:$('underwaterEnabled').checked,level:Number($('waterLevel').value),color:$('waterColor').value,texture:$('waterTexture').value,embeddedTexture:api.world().water?.texture===$('waterTexture').value?api.world().water?.embeddedTexture||'':'',...Object.fromEntries(['scale','speed','warp','flowX','flowY','underwaterStrength','underwaterSpeed','underwaterFrequency'].map(/* @function editor-tools.callback.13 — Returns a list of k, number using $ using "water-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "water-" plus k value. */ k=>[k,Number($('water-'+k).value)]))
      }
      );
    }
    );
    $('testPool').onclick=/* @function editor-tools.onclick.14 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.15 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w terrain edits; w water; w terrain edits at x plus "," plus y; w water cells at x plus "," plus y; w terrain revision. Uses: api world; frontier water pool heights; frontier water validate; frontier terrain base height. */ ()=>{
      const w=api.world(),cx=Math.max(4,Math.min(w.width-5,w.spawn.x-6)),cy=Math.max(4,Math.min(w.height-5,w.spawn.y+4)),pool=FrontierWater.poolHeights(w,cx,cy),bottom=pool.bottom;w.terrain.edits||={
      }
      ;w.water||=FrontierWater.validate();for(let y=Math.floor(cy-3);y<=Math.ceil(cy+3);y++)for(let x=Math.floor(cx-3);x<=Math.ceil(cx+3);x++){
        w.terrain.edits[x+','+y]=bottom-FrontierTerrain.baseHeight(w,x,y);if(x<cx+3&&y<cy+3)w.water.cells[x+','+y]=pool.surface;
      }
      w.terrain.revision=(w.terrain.revision||0)+1;FrontierWater.invalidate(w);
    }
    );
    $('applyFlight').onclick=/* @function editor-tools.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.17 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using flight. Uses: api world; frontier flight validate; $; object from entries. */ ()=>{
      api.world().flight=FrontierFlight.validate({
        mode:$('flightMode').value,...Object.fromEntries(['height','ascent','descent','acceleration','min','max'].map(/* @function editor-tools.callback.18 — Returns a list of k, number using $ using "flight-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "flight-" plus k value. */ k=>[k,Number($('flight-'+k).value)]))
      }
      );
    }
    );
    // Imported previews do not silently pretend to copy files. The map stores filename;
    // desktop/browser exports can resolve that filename from the water asset folder.
    $('waterImport').onchange=/* @function editor-tools.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: reader onload. Uses: $; reader read as data url. Returns: without a result. */ ()=>{
      const f=$('waterImport').files[0];if(!f||f.size>10000000)return;const reader=new FileReader();reader.onload=/* @function editor-tools.onload.20 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using water. Uses: api world; frontier water validate. */ ()=>{
        api.world().water=FrontierWater.validate({
          ...api.world().water,texture:f.name,embeddedTexture:reader.result
        }
        );
      }
      );reader.readAsDataURL(f);
    }
    ;
    // Rebuild editor inputs from authored data after undo/import/restart.
    /* @function editor-tools.refresh.22 — Rebuild editor inputs from authored data after undo/import/restart. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "groundMaterial" value; $ using "libraryType" value; $ using "underwaterEnabled" checked; $ using "waterLevel" value; $ using "waterColor" value. Uses: $; api world; $ using "libraryType" replace children; a list of a record containing id, name, kind, a record containing id, name, kind, a record containing id, name, kind, a record containing id, name, kind map. */ function refresh(){
      if($('groundMaterial'))$('groundMaterial').value=api.world().groundMaterial||'';
      const library=api.world().prefabs||[];if($('libraryType')){
        const old=$('libraryType').value;$('libraryType').replaceChildren(...[{
          id:'builtin-tree',name:'Pine tree',kind:'tree'
        }
        ,{
          id:'builtin-rock',name:'Rock',kind:'rock'
        }
        ,{
          id:'builtin-monster',name:'Sentinel',kind:'monster'
        }
        ,{
          id:'builtin-ruin',name:'Ruined arch',kind:'ruin'
        }
        ,...library].map(/* @function editor-tools.callback.23 — Returns a new option. Inputs: t. Returns: a new option. */ t=>new Option(t.name,t.id)));if(Array.from($('libraryType').options).some(/* @function editor-tools.callback.24 — Returns o value equals old. Inputs: o. Returns: o value equals old. */ o=>o.value===old))$('libraryType').value=old;
      }
      if($('mapEvents')){
        $('mapEvents').replaceChildren(new Option('Choose placed event',''),...(api.world().events||[]).map(/* @function editor-tools.callback.25 — Returns a new option. Inputs: e. Returns: a new option. */ e=>new Option(e.name+' · '+e.id,e.id)));
      }
      const w=api.world().water||FrontierWater.validate();$('underwaterEnabled').checked=w.underwaterEnabled;$('waterLevel').value=w.level;$('waterColor').value=w.color;if(w.texture&&!Array.from($('waterTexture').options).some(/* @function editor-tools.callback.26 — Returns o value equals w texture. Inputs: o. Returns: o value equals w texture. */ o=>o.value===w.texture))$('waterTexture').add(new Option(w.texture,w.texture));$('waterTexture').value=w.texture;for(const k of ['scale','speed','warp','flowX','flowY','underwaterStrength','underwaterSpeed','underwaterFrequency'])$('water-'+k).value=w[k];const f=api.world().flight||FrontierFlight.defaults;$('flightMode').value=f.mode;for(const k of ['height','ascent','descent','acceleration','min','max'])$('flight-'+k).value=f[k];
    }
    let stroke=null;/* @function editor-tools.stamp.27 — Handles stamp within editor tools. Inputs: p; assignment pattern. Uses: number; $; frontier brush paint; api world. */ function stamp(p,factor=1){
      const radius=Math.max(1,Math.min(12,Number($('brushRadius').value)||3)),strength=Math.max(.05,Math.min(2,Number($('brushStrength').value)||.3));FrontierBrush.paint(api.world(),p,$('brushTool').value,radius,strength*factor,Number($('brushHeight').value)||0);
    }
    // Snapshot a brush stroke before any preview mutation.
    /* @function editor-tools.begin.28 — Snapshot a brush stroke before any preview mutation. Inputs: p. Updates: stroke. Uses: structured clone; api world; stamp. Returns: false; true. */ function begin(p){
      if(!p)return false;stroke={
        before:{
          terrain:structuredClone(api.world().terrain),water:structuredClone(api.world().water)
        }
        ,last:p
      }
      ;stamp(p);return true;
    }
    // Distance-based interpolated stamps avoid gaps on fast mouse drags.
    /* @function editor-tools.move.29 — Distance-based interpolated stamps avoid gaps on fast mouse drags. Inputs: p. Updates: stroke last. Uses: stamp. Returns: without a result; without a result. */ function move(p){
      if(!stroke||!p)return;const a=stroke.last,d=Math.hypot(p.x-a.x,p.y-a.y),n=Math.floor(d/.35);if(!n)return;for(let i=1;i<=Math.min(n,100);i++)stamp({
        x:a.x+(p.x-a.x)*i/n,y:a.y+(p.y-a.y)*i/n
      }
      ,.35);stroke.last=p;
    }
    // Roll preview back first, then commit via the shared validated undo path.
    /* @function editor-tools.end.30 — Roll preview back first, then commit via the shared validated undo path. Inputs: assignment pattern. Updates: stroke. Uses: api world; structured clone; object assign; api mutate. Returns: false; true. */ function end(cancel=false){
      if(!stroke)return false;const w=api.world(),after={
        terrain:structuredClone(w.terrain),water:structuredClone(w.water)
      }
      ,before=stroke.before;stroke=null;Object.assign(w,before);if(!cancel)api.mutate(/* @function editor-tools.callback.31 — Returns object assign using api world using , after. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; api world. Returns: object assign using api world using , after. */ ()=>Object.assign(api.world(),after));else api.refresh();return true;
    }
    // Group by purpose without duplicating existing controls. Advanced fields remain
    // inside their established sections; navigation is local to authoring, not game HUD.
    const library=document.createElement('fieldset');library.innerHTML='<legend>Reusable types</legend><label>Name<input id="typeName" maxlength="80" value="New type"></label><label>Base<select id="typeBase"><option value="tree">Tree</option><option value="rock">Rock</option><option value="monster">Enemy / creature</option><option value="ruin">Scenery</option><option value="npc">NPC event</option><option value="selected">Selected event with its pages</option></select></label><label>Sprite profile<select id="typeSprite"><option value="">Vector outline</option></select></label><button id="createType">Create / replace named type</button><p>One entry per type. Placed copies belong to this map and can have their own event pages.</p>';host.append(library);for(const id of FrontierMuzzle.profiles.keys())$('typeSprite').add(new Option(id,id));
    const place=document.createElement('fieldset');place.innerHTML='<legend>Place type</legend><select id="libraryType"></select><button id="useType">Place selected type</button>';$('sceneTool').closest('label').after(place);$('kind').closest('label').hidden=true;const oldPlace=Array.from($('sceneTool').options).find(/* @function editor-tools.callback.32 — Returns o value equals "place". Inputs: o. Returns: o value equals "place". */ o=>o.value==='place');if(oldPlace){
      oldPlace.value='library';oldPlace.textContent='Place type';
    }
    $('useType').onclick=/* @function editor-tools.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "sceneTool" value. Uses: $. */ ()=>{
      $('sceneTool').value='library';
    }
    ;
    $('createType').onclick=/* @function editor-tools.onclick.34 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.35 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: event id; event name; event x; event y; event sprite profile. Uses: api world; $ using "typeName" value trim; $; error. */ ()=>{
      const w=api.world(),name=$('typeName').value.trim();if(!name)throw Error('Name the type first.');const base=$('typeBase').value,selected=(w.events||[]).find(/* @function editor-tools.callback.36 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value. */ e=>e.id===$('selection').value);if(base==='selected'&&!selected)throw Error('Select a placed event first.');const existing=(w.prefabs||[]).find(/* @function editor-tools.callback.37 — Returns t name equals name. Inputs: t. Returns: t name equals name. */ t=>t.name===name),id=existing?.id||'type-'+Date.now(),event=base==='selected'?structuredClone(selected):base==='npc'?FrontierEvents.create(id,1,1):null;if(event){
        event.id=id;event.name=name;event.x=event.y=1;
      }
      if(event&&$('typeSprite').value)event.spriteProfile=$('typeSprite').value;const entry={
        id,name,kind:event?'monster':base,...($('typeSprite').value?{spriteProfile:$('typeSprite').value}:{}),...(event?{
          event
        }
        :{
        }
        )
      }
      ;w.prefabs=(w.prefabs||[]).filter(/* @function editor-tools.callback.38 — Returns t name does not equal name. Inputs: t. Returns: t name does not equal name. */ t=>t.name!==name);w.prefabs.push(entry);
    }
    );
    const events=document.createElement('fieldset');events.innerHTML='<legend>Placed events on this map</legend><select id="mapEvents"></select><button id="editMapEvent">Open event pages</button>';$('editMapEvent');host.append(events);$('editMapEvent').onclick=/* @function editor-tools.onclick.39 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $; api choose; $ using "openEventEditor" click. */ ()=>{
      const id=$('mapEvents').value;if(id){
        api.choose(id);$('openEventEditor').click();
      }
    }
    ;
    const style=document.createElement('fieldset');style.innerHTML='<legend>Selected asset style</legend><select id="assetTreatment"><option value="map">Use map settings</option><option value="original">Original artwork</option><option value="phosphor">Phosphor artwork</option><option value="outline">Outline artwork</option></select><button id="applyAssetStyle">Apply to selected object/event</button>';host.append(style);$('applyAssetStyle').onclick=/* @function editor-tools.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */ ()=>api.mutate(/* @function editor-tools.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e vector treatment. Uses: a list of spread element, spread element find; api world; error; $. */ ()=>{
      const e=[...api.world().objects,...api.world().events].find(/* @function editor-tools.callback.42 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value. */ e=>e.id===$('selection').value);if(!e)throw Error('Select an object/event first.');e.vectorTreatment=$('assetTreatment').value;
    }
    );
    // Saves belong to the live session. Entering authoring starts a fresh session,
    // so keep these controls outside the editor tabs and their hidden host.
    const saveLabel=document.getElementById('saveCombat')?.closest('label');
    if(saveLabel){const saves=document.createElement('fieldset');saves.id='playtestSaveControls';const legend=document.createElement('legend');legend.textContent='Playtest progress';saves.append(legend,saveLabel);host.parentElement.insertBefore(saves,host);}
    // Keep playtest controls available in Database, with general help collapsed.
    const combat=Array.from(document.querySelectorAll('fieldset')).find(/* @function editor-tools.callback.43 — Returns chain equals "Combat testing". Inputs: el. Uses: el query selector. Returns: chain equals "Combat testing". */ el=>el.querySelector('legend')?.textContent==='Combat testing');if(combat)host.append(combat);
    const nav=document.createElement('nav');nav.className='editorTabs';const sections={
      Map:[],Room:[],Terrain:[],Place:[],Events:[],Database:[],Vectrex:[]
    }
    ;
    for(const el of Array.from(host.children)){
      if(['undo','redo'].includes(el.id))continue;
      const title=el.querySelector('legend')?.textContent||'';let tab='Place';if(el.id==='export'||el.querySelector('#import'))tab='Map';else if(/Interior|Room |Map connections|Normal-map/.test(title))tab='Room';else if(/Vectrex|Vector beam/.test(title))tab='Vectrex';else if(/Terrain brush|Water material|Landscape/.test(title))tab='Terrain';else if(/Blood \/ Cerebral|movement ability|Global parameters|Reusable types|Selected asset style|Combat testing/.test(title))tab='Database';else if(/Map library|bounds|activity|Soundtrack|distance fog|Vector beam|click feedback/.test(title))tab='Map';else if(el.id==='eventInspector'||/Placed events/.test(title))tab='Events';sections[tab].push(el);
    }
    let selected='Place';/* @function editor-tools.select.44 — Handles select within editor tools. Inputs: tab. Updates: selected; $ using "sceneTool" value. Uses: end; object entries; el class list toggle; btn set attribute. */ function select(tab){
      selected=tab;if(stroke)end(true);for(const [name,items]of Object.entries(sections))for(const el of items)el.classList.toggle('toolTabHidden',name!==tab);for(const btn of nav.children)btn.setAttribute('aria-pressed',String(btn.textContent===tab));if(tab==='Terrain')$('sceneTool').value='brush';else if($('sceneTool').value==='brush')$('sceneTool').value='select';
    }
    for(const tab of Object.keys(sections)){
      const btn=document.createElement('button');btn.textContent=tab;btn.onclick=/* @function editor-tools.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: select. Returns: select using tab. */ ()=>select(tab);nav.append(btn);
    }
    const actions=document.createElement('div');actions.className='editorActions';$('undo').textContent='Undo change';actions.append($('undo'),$('redo'));host.prepend(actions);host.prepend(nav);select('Place');refresh();return {
      begin,move,end,refresh,select,active:/* @function editor-tools.active.46 — Returns $ using "sceneTool" value equals "brush". Inputs: no explicit arguments; uses enclosing module state. Uses: $. Returns: $ using "sceneTool" value equals "brush". */ ()=>$('sceneTool').value==='brush'
    }
    ;
  }
  root.FrontierEditorTools={
    create
  }
  ;
}
)(window);

