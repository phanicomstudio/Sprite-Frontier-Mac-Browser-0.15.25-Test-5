/* October 29, 2026: responsive original inventory screen. Coordinate regions
 * come from an independent skin manifest so later glass/background layers can
 * surround the same live item content without recoding inventory behavior. */
(/* @function inventoryScreen.install — Inputs: browser namespace. Publishes the original-art inventory presentation factory; the existing coordinator retains pause/cursor/save/equipment ownership. */ function(root){

  'use strict';

  /* @function inventoryScreen.create — Inputs: existing inventory root, retained Close button/list nodes and a coordinator action callback. Returns render/scroll/select methods. Mounts original artwork and invisible artwork-aligned control regions once; no quantities or authored definitions are created. */
  function create(panel,closeButton,legacyList,action){

    const skin=root.FrontierInventorySkins.default,toolbar=document.createElement('div'),device=document.createElement('div'),base=document.createElement('img'),description=document.createElement('section'),items=document.createElement('div'),status=document.createElement('p');

    panel.classList.add('inventoryDevicePanel');
    toolbar.className='inventoryDeviceToolbar';
    toolbar.append('INVENTORY',closeButton);
    device.className='inventoryDeviceCase';
    device.style.aspectRatio=skin.width+'/'+skin.height;
    device.dataset.skin=skin.id;
    base.src=skin.base;
    base.alt='Inventory screen and controller';
    base.className='inventoryDeviceBase';
    device.append(base);
    description.className='inventoryDeviceDescription';
    description.setAttribute('aria-live','polite');
    items.className='inventoryDeviceItems';
    items.setAttribute('aria-label','Carried items');
    status.className='inventoryDeviceStatus';
    status.setAttribute('role','status');
    device.append(description,items,status);
    legacyList.hidden=true;
    panel.replaceChildren(toolbar,device,legacyList);
    let rows=[],selected='',offset=0,lastSignature='';

    /* @function inventoryScreen.region — Inputs: DOM element and skin region name. Positions against original pixels in percentage units; CSS resize/fullscreen changes affect content and invisible buttons together. No image resampling or game state mutation. */
    function region(element,name){
      const [x,y,w,h]=skin.regions[name];
      Object.assign(element.style,{
        left:x/skin.width*100+'%',top:y/skin.height*100+'%',width:w/skin.width*100+'%',height:h/skin.height*100+'%'
      });
    }

    region(description,'description');
    region(items,'items');
    region(status,'status');

    /* @function inventoryScreen.report — Inputs: ordinary message. Replaces local status text with safe textContent; no HTML/note execution or save mutation. */
    function report(message){
      status.textContent=message;
    }

    /* @function inventoryScreen.apply — Inputs: action name. Dispatches only the selected real item to coordinator; errors remain visible and do not close or consume anything implicitly. */
    function apply(name){
      if(name==='close'){
        closeButton.click();
        return;
      }
      if(!selected){
        report('Select an item first.');
        return;
      }
      try{
        const result=action(name,selected);
        if(result)report(result);
      }
      catch(error){
        report(error.message);
      }
    }

    for(const [key,label]of [['up','Scroll items up'],['down','Scroll items down'],['equip','Equip selected item'],['use','Use selected item'],['drop','Drop one selected item'],['close','Close inventory']]){
      const button=document.createElement('button');
      button.type='button';
      button.className='inventoryDeviceHit';
      button.dataset.inventoryAction=key;
      button.setAttribute('aria-label',label);
      button.title=label;
      region(button,key);
      button.onclick=/* @function inventoryScreen.physicalButton — Inputs: artwork-hit click ignored. Scrolls one two-column row through original D-pad up/down bars or dispatches one supported physical action. The button has no drawn placeholder face. */function(){
        if(key==='up'||key==='down')scroll(key==='up'?-1:1);
        else apply(key);
      };
      device.append(button);
    }

    /* @function inventoryScreen.select — Inputs: stable carried ID. Selects only a current row and renders its full name/description; does not equip/use on selection. No name-based identity matching. */
    function select(id){
      if(!rows.some(/* @function inventoryScreen.hasRow — Inputs: display row. Returns stable identity membership. */function(row){
        return row.id===id;
      }))return;
      selected=id;
      paint();
    }

    /* @function inventoryScreen.scroll — Inputs: signed whole two-column row steps. Replaces item labels in place, clamped to first/last pair. Keeps the selected description until another item is clicked. */
    function scroll(delta){
      offset=Math.max(0,Math.min(Math.max(0,Math.ceil(rows.length/2)-4)*2,offset+Math.trunc(delta)*2));
      paint();
    }

    /* @function inventoryScreen.paint — Inputs: none. Draws at most eight real carried entries and a selected description, with optional inventory image over the supplied screen. Selection/hit regions stay independent from future layer artwork; empty slots create no fake items. */
    function paint(){
      items.replaceChildren();
      description.replaceChildren();
      const current=rows.find(/* @function inventoryScreen.selectedRow — Inputs: display row. Returns exact currently selected item. */function(row){
        return row.id===selected;
      });
      if(current){
        const title=document.createElement('h3'),text=document.createElement('p');
        title.textContent=current.name+(current.equipped?' — equipped':'');
        text.textContent=current.description;
        if(current.image){
          const image=document.createElement('img');
          image.src=current.image;
          image.alt=current.name;
          description.append(image);
        }
        description.append(title,text);
      }
      else description.textContent=rows.length?'Select an item to read its description.':'Inventory is empty.';
      for(const row of rows.slice(offset,offset+8)){
        const button=document.createElement('button');
        button.type='button';
        button.dataset.inventoryItem=row.id;
        button.setAttribute('aria-pressed',String(row.id===selected));
        button.textContent=row.name+' × '+row.count;
        button.title=row.name+' × '+row.count;
        button.onclick=/* @function inventoryScreen.choose — Inputs: carried-item click ignored. Selects only its stable item record; physical action remains explicit. */function(){
          select(row.id);
        };
        items.append(button);
      }
      const hint=document.createElement('small');
      hint.textContent=rows.length?`${offset+1}–${Math.min(rows.length,offset+8)} / ${rows.length}`:'';
      items.append(hint);
      for(const [key,disabled]of [['equip',!current?.weaponProfile],['use',!current?.canUse],['drop',!current],['up',offset===0],['down',offset+8>=rows.length]])device.querySelector('[data-inventory-action="'+key+'"]').disabled=disabled;
    }

    /* @function inventoryScreen.render — Inputs: detached live rows and optional actor/status signature. Repaints only changed display state to preserve focus and avoid per-frame DOM churn. No inventory ownership changes. */
    function render(value,signature=''){
      const next=JSON.stringify(value)+'|'+signature;
      if(next===lastSignature)return;
      lastSignature=next;
      rows=value;
      if(!rows.some(/* @function inventoryScreen.retainSelection — Inputs: display row. Returns current stable selection membership after stock changes. */function(row){
        return row.id===selected;
      }))selected=rows[0]?.id||'';
      offset=Math.min(offset,Math.max(0,Math.ceil(rows.length/2)-4)*2);
      paint();
    }

    device.addEventListener('wheel',/* @function inventoryScreen.wheel — Inputs: wheel gesture. Scrolls only the inventory pair list and consumes camera/page zoom, regardless of whether the pointer is over empty screen or labels. */function(event){
      event.preventDefault();
      event.stopPropagation();
      scroll(event.deltaY<0?-1:1);
    },{
      passive:false
    });

    document.addEventListener('keydown',/* @function inventoryScreen.keyboard — Inputs: document keydown. While the original inventory is open, arrows/Page/Home/End move the in-place item list, Escape/I delegate original Close, and E/U/D request explicit actions. Gameplay hotkeys are isolated; F2 reaches the editor reset after closing. Text-entry controls elsewhere are never handled when closed. */function(event){
      if(panel.hidden)return;
      const key=event.key.toLowerCase();
      if(key==='f2'){
        closeButton.click();
        return;
      }
      if(key==='escape'||key==='i'){
        event.preventDefault();
        event.stopImmediatePropagation();
        closeButton.click();
        return;
      }
      if(['arrowup','arrowdown','pageup','pagedown','home','end','e','u','d'].includes(key)){
        event.preventDefault();
        if(key==='home')offset=0;
        else if(key==='end')offset=Math.max(0,Math.ceil(rows.length/2)-4)*2;
        else if(key==='e'||key==='u'||key==='d')apply({
          e:'equip',u:'use',d:'drop'
        }
        [key]);
        else scroll((key==='arrowup'||key==='pageup'?-1:1)*(key.startsWith('page')?4:1));
        paint();
      }
      event.stopImmediatePropagation();
    },{
      capture:true
    });

    return {
      render,scroll,select,report
    };


  }

  root.FrontierInventoryScreen={
    create
  };


})(window);
