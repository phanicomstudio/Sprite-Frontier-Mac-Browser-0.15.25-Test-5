/* October 29, 2026: one focused item/recipe authoring dialog. The project owns adoption/history; this UI owns only detached drafts. */
(/* @function catalogEditor.install — Inputs: browser namespace. Publishes a focused authoring factory; runtime exports do not instantiate it. No starting inventory or production recipes are created. */ function(root){

'use strict';

/* @function catalogEditor.create — Inputs: project API read/save/allowed. Returns open and attaches a discoverable Items & Recipes button. One item is edited at a time; stable IDs and extra imported metadata survive normal edits. Errors retain the unsaved draft. */
function create(api){

 const dialog=document.createElement('dialog');
    dialog.id='itemRecipeEditor';
    dialog.className='mzDialog catalogEditor1611';
    document.body.append(dialog);
    let items=[],recipes=[],selected='',recipeId='';

 const button=document.createElement('button');
    button.type='button';
    button.id='openItemsRecipes';
    button.textContent='Items & Recipes';
    button.dataset.authoringOnly='true';
    document.querySelector('header').append(button);

 /* @function catalogEditor.control — Inputs: parent, label, control kind, initial value and optional choices. Returns a safely text-labeled input/select/textarea in the detached dialog. No markup from item names is executed. */
 function control(parent,label,type,value,options){
      const wrap=document.createElement('label'),input=document.createElement(type==='select'?'select':type==='textarea'?'textarea':'input');
      wrap.textContent=label;
      if(input.tagName==='INPUT')input.type=type;
      input.setAttribute('aria-label',label);
      for(const option of options||[])input.append(new Option(option[1],option[0]));
      if(type==='checkbox')input.checked=!!value;
      else input.value=value??'';
      wrap.append(input);
      parent.append(wrap);
      return input;
    }

 /* @function catalogEditor.action — Inputs: parent, label and documented click callback. Returns attached button; callbacks retain draft errors in the status region. No implicit project save. */
 function action(parent,label,callback){
      const b=document.createElement('button');
      b.type='button';
      b.textContent=label;
      b.onclick=/* @function catalogEditor.runAction — Inputs: ignored click. Runs the requested local/adoption action and preserves draft on readable failure. */function(){
        try{
          callback();
        }
        catch(error){
          dialog.querySelector('[role=status]').textContent=error.message;
        }
      };
      parent.append(b);
      return b;
    }

 /* @function catalogEditor.draw — Inputs: none. Displays searchable definitions and one selected form plus recipe form. Rebuilding happens only on explicit selection/draft action, never on a frame. */
 function draw(){
      dialog.replaceChildren();
      const title=document.createElement('h2');
      title.textContent='Items & Recipes';
      dialog.append(title);
      const status=document.createElement('p');
      status.setAttribute('role','status');
      dialog.append(status);
      const columns=document.createElement('div');
      columns.className='catalogColumns1611';
      dialog.append(columns);
      const list=document.createElement('section'),form=document.createElement('section'),recipeForm=document.createElement('section');
      columns.append(list,form,recipeForm);
      const search=control(list,'Find item','search',''),select=control(list,'Items','select',selected,items.map(/* @function catalogEditor.listItem — Inputs: definition. Returns identity/readable name option, retaining duplicate display names as distinct items. */function(item){
        return [item.id,item.name];
      }));
      select.size=12;

 search.oninput=/* @function catalogEditor.search — Inputs: search change ignored. Filters visible choices by name/ID without deleting draft definitions or changing identity. */function(){
        select.replaceChildren();
        const q=search.value.toLowerCase();
        for(const item of items)if((item.name+' '+item.id).toLowerCase().includes(q))select.append(new Option(item.name,item.id));
      };

 select.onchange=/* @function catalogEditor.select — Inputs: selection change ignored. Opens one saved local definition; form edits require Keep item edits before changing rows. */function(){
        selected=select.value;
        draw();
      };

 action(list,'New item',/* @function catalogEditor.newItem — Inputs: none. Adds a new stable UUID definition to detached draft only. No item is granted to a player. */function(){
        const item={
          id:'item-'+crypto.randomUUID(),name:'New item',price:0,graphic:'chest',properties:{
            category:'item'
          }
        };
        items.push(item);
        selected=item.id;
        draw();
      });

action(list,'Add missing starter items',/* @function catalogEditor.addStarterItems — Inputs: none. Adds only missing shipped starter-item identities to a custom catalog draft. Existing names/properties/prices are never overwritten; no inventory quantities or source recipes are activated. */function(){
 const known=new Set(items.map(/* @function catalogEditor.knownStarter — Inputs: definition. Returns existing stable ID. */function(item){return item.id;}));
 for(const item of root.FrontierItemDefinitions.defaults())if((item.id.startsWith('material-')||item.id==='weapon-starter-melee')&&!known.has(item.id)){items.push(item);known.add(item.id);}draw();
});
 action(list,'Duplicate item',/* @function catalogEditor.duplicate — Inputs: none. Clones selected definition under a new stable ID while retaining visual/properties/source history. Existing inventories continue referencing the original. */function(){
        const old=items.find(/* @function catalogEditor.copySource — Inputs: definition. Returns current stable match. */function(item){
          return item.id===selected;
        });
        if(!old)throw Error('Select an item.');
        const copy={
          ...structuredClone(old),id:'item-'+crypto.randomUUID(),name:old.name+' copy'
        };
        items.push(copy);
        selected=copy.id;
        draw();
      });

 action(list,'Remove item from draft',/* @function catalogEditor.remove — Inputs: none. Removes only detached definition; owner Save rejects removal if referenced anywhere in project/state/recipes. */function(){
        items=items.filter(/* @function catalogEditor.retain — Inputs: definition. Returns all except explicitly selected identity. */function(item){
          return item.id!==selected;
        });
        selected=items[0]?.id||'';
        draw();
      });

 const item=items.find(/* @function catalogEditor.current — Inputs: definition. Returns current stable identity match. */function(item){
        return item.id===selected;
      });

 if(item){
        const id=document.createElement('p');
        id.textContent='ID: '+item.id;
        form.append(id);
        const name=control(form,'Name','text',item.name),description=control(form,'Description','textarea',item.properties?.description||item.description||''),category=control(form,'Category','select',item.properties?.category||'item',[['item','Item'],['weapon','Weapon'],['ammo','Ammunition'],['blueprint','Blueprint'],['tool','Tool'],['equipment','Equipment']]),price=control(form,'Price','number',item.price),healing=control(form,'Healing (HP)','number',item.properties?.restoreHp||0),weapon=control(form,'Equipped weapon','select',item.properties?.weaponProfile||'',[['','None'],...[...root.PhanicomABS.weapons.keys()].map(/* @function catalogEditor.weapon — Inputs: existing native profile ID. Returns actual profile choice without adding a combat type. */function(id){
          return [id,id];
        })]),image=control(form,'Inventory image path or PNG data','text',item.inventoryImage||''),upload=control(form,'Choose inventory PNG','file','');
        upload.accept='image/png';
        upload.onchange=/* @function catalogEditor.image — Inputs: local PNG selection ignored. Loads at most 512 KiB into portable image draft; no asset file is overwritten. Invalid/failed load keeps prior image. */async function(){
          try{
            const file=upload.files[0];
            if(!file)return;
            if(file.type!=='image/png'||file.size>524288)throw Error('Choose a PNG under 512 KiB.');
            const data=await new Promise(/* @function catalogEditor.readImage — Inputs: resolve/reject callbacks. Reads user-selected bytes as PNG data URL; errors reject without mutation. */function(resolve,reject){
              const reader=new FileReader();
              reader.onload=/* @function catalogEditor.loadedImage — Inputs: load event ignored. Resolves original selected bytes. */function(){
                resolve(reader.result);
              };
              reader.onerror=/* @function catalogEditor.failedImage — Inputs: read error ignored. Rejects safe error. */function(){
                reject(Error('Image could not be read.'));
              };
              reader.readAsDataURL(file);
            });
            const decoded=new Image();
            decoded.src=data;
            await decoded.decode();
            if(decoded.width>4096||decoded.height>4096)throw Error('Inventory image must be at most 4096 pixels per side.');
            image.value=data;
          }
          catch(error){
            status.textContent=error.message;
          }
        };

 action(form,'Keep item edits',/* @function catalogEditor.keepItem — Inputs: none. Validates this detached edited definition, preserving unrelated properties and source IDs. No save or stock changes until project Save. */function(){
          const next={
            ...item,name:name.value,price:Number(price.value),inventoryImage:image.value,properties:{
              ...item.properties,description:description.value,category:category.value,restoreHp:Number(healing.value)
            }
          };
          if(weapon.value)next.properties.weaponProfile=weapon.value;
          else delete next.properties.weaponProfile;
          const checked=root.FrontierItemDefinitions.validate([next])[0];
          items[items.indexOf(item)]=checked;
          draw();
        });
      }

 const recipeChoice=control(recipeForm,'Recipe','select',recipeId,[['','New recipe'],...recipes.map(/* @function catalogEditor.recipeOption — Inputs: canonical draft recipe. Returns stable choice. */function(recipe){
        return [recipe.id,recipe.name];
      })]);
      recipeChoice.onchange=/* @function catalogEditor.selectRecipe — Inputs: selection ignored. Opens existing detached recipe. */function(){
        recipeId=recipeChoice.value;
        draw();
      };
      const recipe=recipes.find(/* @function catalogEditor.currentRecipe — Inputs: recipe. Returns selected stable match. */function(r){
        return r.id===recipeId;
      });
      const recipeName=control(recipeForm,'Recipe name','text',recipe?.name||''),options=[['','Choose item'],...items.map(/* @function catalogEditor.componentOption — Inputs: draft item. Returns shared identity for ingredients and result. */function(item){
        return [item.id,item.name];
      })],requirements=[];

 for(let i=0;i<5;i++){
        const prior=recipe?.ingredients[i],box=document.createElement('fieldset');
        recipeForm.append(box);
        const component=control(box,'Ingredient '+(i+1),'select',prior?.itemId||'',options),quantity=control(box,'Quantity '+(i+1),'number',prior?.quantity||1),consume=control(box,'Consume '+(i+1),'checkbox',prior?.consume??true);
        quantity.min='1';
        quantity.step='1';
        requirements.push({
          component,quantity,consume
        });
      }

 const output=control(recipeForm,'Result item','select',recipe?.result.itemId||'',options),amount=control(recipeForm,'Result quantity','number',recipe?.result.quantity||1);
      amount.min='1';
      amount.step='1';
      action(recipeForm,'Keep recipe edits',/* @function catalogEditor.keepRecipe — Inputs: none. Validates ingredient references/counts/retention and result before replacing detached recipe. Exact alternatives remain distinct IDs. No runtime crafting occurs. */function(){
        const next={
          id:recipeId||'recipe-'+crypto.randomUUID(),name:recipeName.value,ingredients:requirements.filter(/* @function catalogEditor.usedRequirement — Inputs: ingredient controls. Returns explicitly filled rows only. */function(row){
            return !!row.component.value;
          }).map(/* @function catalogEditor.requirement — Inputs: filled controls. Returns typed canonical draft requirement. */function(row){
            return {
              itemId:row.component.value,quantity:Number(row.quantity.value),consume:row.consume.checked
            };
          }),result:{
            itemId:output.value,quantity:Number(amount.value)
          }
        };
        root.FrontierCrafting.validate([next],items);
        recipes=recipes.filter(/* @function catalogEditor.replaceRecipe — Inputs: existing recipe. Retains all other identities. */function(r){
          return r.id!==next.id;
        });
        recipes.push(next);
        recipeId=next.id;
        draw();
      });

 action(recipeForm,'Remove recipe',/* @function catalogEditor.deleteRecipe — Inputs: none. Removes only selected detached recipe, leaving item definitions/inventories unchanged. */function(){
        recipes=recipes.filter(/* @function catalogEditor.keepOtherRecipe — Inputs: recipe. Returns nonselected identities. */function(r){
          return r.id!==recipeId;
        });
        recipeId='';
        draw();
      });

 action(dialog,'Save project definitions',/* @function catalogEditor.save — Inputs: none. Applies complete validated catalog/recipes through project transaction, preserving other defaults/history and rejecting referenced-ID loss. Closes only after success. */function(){
        api.save({
          items:root.FrontierItemDefinitions.validate(items),recipes:root.FrontierCrafting.validate(recipes,items)
        });
        dialog.close();
      });
      action(dialog,'Cancel',/* @function catalogEditor.cancel — Inputs: none. Closes and discards detached changes; no project or inventory effect. */function(){
        dialog.close();
      });
    }

 /* @function catalogEditor.open — Inputs: optional ignored click. Copies project definitions only in authoring; initializes one selected row and no invented recipe. */
 function open(){
      if(!api.allowed())return;
      const current=api.read();
      items=structuredClone(current.items);
      recipes=structuredClone(current.recipes);
      selected=items[0]?.id||'';
      recipeId='';
      draw();
      dialog.showModal();
    }

 button.onclick=open;
    return {
      open
    };


  }

root.FrontierCatalogEditor={
    create
  };


})(window);
