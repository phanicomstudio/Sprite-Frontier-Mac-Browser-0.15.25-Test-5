/* October 29, 2026: native Zimmerit selection menu. Quantities and retained components use the existing inventory transaction, not a parallel crafting bank. */
(/* @function craftingMenu.install — Inputs: browser namespace. Publishes a menu factory without changing saves, recipes or input ownership until opened. */ function(root){

  'use strict';

  /* @function craftingMenu.create — Inputs: coordinator allowed/prepare/finish/game/state/recipes API. Returns open/reset. Uses five explicit component slots, exact order-independent matching and selectable outputs as in the supplied plugin. No authored recipes are invented. */
  function create(api){

    const panel=document.createElement('section');
    panel.id='craftingPanel';
    panel.hidden=true;
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-label','Combine items');

    panel.innerHTML='<h2>Combine items</h2><p>Choose up to five components and quantities. Blueprints and tools marked “kept” are not consumed.</p><div class="craftingSlots"></div><div class="craftingResults"></div><p role="status"></p><button type="button" data-close>Close</button>';

    document.getElementById('gameFrame').append(panel);
    const slots=panel.querySelector('.craftingSlots'),results=panel.querySelector('.craftingResults'),status=panel.querySelector('[role=status]');
    let prior=null,choices=[];

    const remote=document.createElement('button');
    remote.id='remoteCrafting';
    remote.type='button';
    remote.textContent='COMBINE';
    remote.title='Combine items';
    document.querySelector('.remoteDevice').append(remote);

    /* @function craftingMenu.read — Inputs: none. Returns selected nonempty slots as item/count rows; validators reject invalid numbers before matching or spending stock. No inventory mutation. */
    function read(){
      return choices.filter(/* @function craftingMenu.filled — Inputs: local slot controls. Returns whether an actual item is selected. */function(row){
        return !!row.item.value;
      }).map(/* @function craftingMenu.slot — Inputs: local slot controls. Returns detached physical component row. */function(row){
        return {
          itemId:row.item.value,quantity:Number(row.count.value),consume:true
        };
      });
    }

    /* @function craftingMenu.refresh — Inputs: none. Rebuilds only candidate outputs after component changes. Missing/ambiguous recipes never auto-consume stock; matching alternatives remain explicit buttons. */
    function refresh(){
      results.replaceChildren();
      try{
        const matches=root.FrontierCrafting.match(api.recipes(),read());
        if(!matches.length)results.textContent='No matching recipe. Define recipes in Items & Recipes.';
        for(const recipe of matches){
          const button=document.createElement('button');
          button.type='button';
          button.textContent=recipe.name+' → '+root.FrontierInventory.definition(recipe.result.itemId).name+' × '+recipe.result.quantity;
          const kept=recipe.ingredients.filter(/* @function craftingMenu.retained — Inputs: requirement. Returns whether this component stays in inventory. */function(row){
            return !row.consume;
          });
          button.title=kept.length?'Kept: '+kept.map(/* @function craftingMenu.keptName — Inputs: retained row. Returns readable actual definition name and required count. */function(row){
            return root.FrontierInventory.definition(row.itemId).name+' × '+row.quantity;
          }).join(', '):'All selected components are consumed.';
          button.onclick=/* @function craftingMenu.combine — Inputs: output click ignored. Executes one atomic real-stock transaction; failures stay visible without losing components. Success refreshes counts and preserves current selection for repeat crafting. */function(){
            try{
              root.FrontierArsenal.prepare(api.game());
              const made=root.FrontierInventory.craft(api.game(),api.state(),recipe);
              status.textContent='Created '+root.FrontierInventory.definition(made.itemId).name+' × '+made.quantity;
              populate();
            }
            catch(error){
              status.textContent=error.message;
            }
          };
          results.append(button);
        }
      }
      catch(error){
        status.textContent=error.message;
      }
    }

    /* @function craftingMenu.populate — Inputs: none. Updates slot choices from positive actual carried counts, retaining still-owned component selection. Output stock appears only after successful transaction. No fake materials or blueprint grants. */
    function populate(){
      const rows=root.FrontierInventory.rows(api.game());
      for(const row of choices){
        const selected=row.item.value;
        row.item.replaceChildren(new Option('Choose component',''));
        for(const item of rows)row.item.append(new Option(item.name+' × '+item.count,item.id));
        row.item.value=rows.some(/* @function craftingMenu.keepChoice — Inputs: live item row. Returns prior selection membership after consumption. */function(item){
          return item.id===selected;
        })?selected:'';
      }
      refresh();
    }

    for(let i=0;i<5;i++){
      const label=document.createElement('label'),item=document.createElement('select'),count=document.createElement('input');
      label.textContent='Component '+(i+1);
      item.setAttribute('aria-label','Component '+(i+1));
      count.type='number';
      count.min='1';
      count.max='1000000';
      count.step='1';
      count.value='1';
      count.setAttribute('aria-label','Quantity '+(i+1));
      item.onchange=refresh;
      count.oninput=refresh;
      label.append(item,count);
      slots.append(label);
      choices.push({
        item,count
      });
    }

    /* @function craftingMenu.open — Inputs: ignored remote click. Acquires original coordinator pause/cursor ownership only in allowed idle gameplay, then populates real stock. Repeated open has no effect. */
    function open(){
      if(!panel.hidden||!api.allowed())return;
      prior=api.prepare();
      panel.hidden=false;
      status.textContent='';
      root.FrontierInventory.ensure(api.game(),api.state());
      populate();
      panel.querySelector('select').focus();
    }

    /* @function craftingMenu.reset — Inputs: none. Closes menu and restores exactly its acquired input ownership. No pending draft can consume inventory; safe on repeated reset and cell replacement. */
    function reset(){
      if(panel.hidden)return;
      panel.hidden=true;
      api.finish(prior);
      prior=null;
    }

    remote.onclick=open;
    panel.querySelector('[data-close]').onclick=reset;
    document.addEventListener('keydown',/* @function craftingMenu.keyboard — Inputs: keyboard event. Escape closes; other keys remain inside controls and cannot trigger shooting/movement. F2 closes then reaches the editor coordinator. Closed menus never intercept input. */function(event){
      if(panel.hidden)return;
      if(event.key==='F2'){
        reset();
        return;
      }
      if(event.key==='Escape'){
        event.preventDefault();
        reset();
      }
      event.stopImmediatePropagation();
    },{
      capture:true
    });

    return {
      open,reset,opened:/* @function craftingMenu.opened — Inputs: none. Returns actual menu visibility for original coordinator input/pause ownership. */function(){
        return !panel.hidden;
      }
    };


  }

  root.FrontierCraftingMenu={
    create
  };


})(window);
