/* October 29, 2026: native order-independent Zimmerit recipes.
 * Items, blueprints and tools share the existing catalog/inventory owner.
 * Retention is an ingredient property, not a parallel recipe-unlock system. */
(/* @function crafting.install — Inputs: browser/global namespace. Publishes pure recipe validation/matching and an atomic existing-inventory transaction. No recipes, items, timers or progression are created at module load. */ function(root){

  'use strict';

  /* @function crafting.normalize — Inputs: one-to-five ingredient rows. Returns stable item-ID sorted merged requirements, enforcing finite positive whole quantities and boolean consumption. Mixed retained/consumed duplicate tokens use consumed-wins, matching the supplied plugin. Rejects malformed drafts before any mutation. */
  function normalize(rows){

    if(!Array.isArray(rows)||rows.length<1||rows.length>5)throw Error('A recipe needs one to five ingredient rows.');

    const merged=new Map();

    for(const row of rows){
      if(!row||typeof row.itemId!=='string'||!row.itemId.trim()||row.itemId.length>100||!Number.isSafeInteger(row.quantity)||row.quantity<1||row.quantity>1000000||typeof row.consume!=='boolean')throw Error('Ingredients need an item, positive whole quantity and consumed/retained choice.');
      const prior=merged.get(row.itemId);
      if(prior){
        prior.quantity+=row.quantity;
        prior.consume ||= row.consume;
        if(prior.quantity>1000000)throw Error('Ingredient quantity is too large.');
      }
      else merged.set(row.itemId,{
        itemId:row.itemId,quantity:row.quantity,consume:row.consume
      });
    }

    return [...merged.values()].sort(/* @function crafting.sortIngredients — Inputs: normalized ingredient pair. Returns stable lexical item-ID order independent of selection order; changes only the detached result list. */function(a,b){
      return a.itemId.localeCompare(b.itemId);
    });


  }

  /* @function crafting.validate — Inputs: optional recipe list and optional actual item definitions. Returns detached canonical recipes; rejects duplicate identities, unknown referenced items, invalid outputs and oversized lists. Empty means no authored recipes, never an invented production combination. */
  function validate(value=[],catalog){

    if(!Array.isArray(value)||value.length>2000)throw Error('Recipes must be a list of at most 2,000.');
    const ids=new Set(),known=catalog?new Set(catalog.map(/* @function crafting.catalogId — Inputs: definition. Returns stable ID for recipe reference validation. */function(item){
      return item.id;
    })):null,result=[];

    for(const recipe of value){
      if(!recipe||typeof recipe.id!=='string'||!recipe.id||recipe.id.length>100||ids.has(recipe.id)||typeof recipe.name!=='string'||!recipe.name.trim()||recipe.name.length>120||!recipe.result||typeof recipe.result.itemId!=='string'||!recipe.result.itemId||recipe.result.itemId.length>100||!Number.isSafeInteger(recipe.result.quantity)||recipe.result.quantity<1||recipe.result.quantity>1000000)throw Error('Recipes need unique IDs, names and a valid result quantity.');
      const ingredients=normalize(recipe.ingredients);
      if(known){
        for(const row of [...ingredients,recipe.result])if(!known.has(row.itemId))throw Error('Unknown recipe item: '+row.itemId);
      }
      ids.add(recipe.id);
      result.push({
        id:recipe.id,name:recipe.name,ingredients,result:{
          itemId:recipe.result.itemId,quantity:recipe.result.quantity
        }
      });
    }

    return result;


  }

  /* @function crafting.signature — Inputs: ingredient selection with item IDs/quantities. Returns order-independent physical signature; consumption does not influence matching, as in the supplied plugin. No inventory or recipe changes. */
  function signature(rows){
    return normalize(rows.map(/* @function crafting.matchRow — Inputs: selection row. Returns detached physical row; retained metadata is irrelevant to selecting components. */function(row){
      return {
        ...row,consume:!!row.consume
      };
    })).map(/* @function crafting.signatureRow — Inputs: merged row. Returns unambiguous JSON item/count tuple. */function(row){
      return JSON.stringify([row.itemId,row.quantity]);
    }).join('|');
  }

  /* @function crafting.match — Inputs: validated recipes and selected one-to-five component rows. Returns all recipes with the exact physical signature, allowing distinct selectable outputs. No recipe discovery/unlock is inferred. Empty selection returns empty. */
  function match(recipes,selected){
    if(!selected.length)return [];
    const key=signature(selected);
    return recipes.filter(/* @function crafting.matchesRecipe — Inputs: canonical recipe. Returns exact signature match without stock mutation. */function(recipe){
      return signature(recipe.ingredients)===key;
    });
  }

  /* @function crafting.execute — Inputs: recipe, authoritative event inventory Map, existing hub detail store, actual catalog and optional whole batch count1–1000. Returns crafted ID/count after complete validation. Uses detached quantity/carried drafts, preserving retained tools and stack metadata; insufficient ingredients/output capacity fail without consuming anything. Commits only inventory and carried details, not cells, ownership clocks or unrelated state. */
  function execute(recipe,inventory,store,catalog,batches=1){

    const checked=validate([recipe],catalog)[0];
    if(!(inventory instanceof Map)||!store||!Array.isArray(store.carried)||!Number.isSafeInteger(batches)||batches<1||batches>1000)throw Error('Invalid crafting transaction.');
    const next=new Map(inventory),draft={
      ...store,carried:structuredClone(store.carried)
    };

    for(const row of checked.ingredients){
      const count=row.quantity*(row.consume?batches:1);
      if(count>1000000||(next.get(row.itemId)||0)<count)throw Error('Missing ingredient: '+row.itemId);
    }

    for(const row of checked.ingredients)if(row.consume){
      const count=row.quantity*batches;
      let remaining=count;
      for(let i=0;i<draft.carried.length&&remaining;i++){
        const stack=draft.carried[i];
        if(stack.itemId!==row.itemId)continue;
        const used=Math.min(remaining,stack.quantity);
        stack.quantity-=used;
        remaining-=used;
      }
      draft.carried=draft.carried.filter(/* @function crafting.keepStack — Inputs: detached stack after consumption. Retains positive counts; ownership of unconsumed/retained stacks stays untouched. */function(stack){
        return stack.quantity>0;
      });
      const countLeft=(next.get(row.itemId)||0)-count;
      if(countLeft)next.set(row.itemId,countLeft);
      else next.delete(row.itemId);
    }

    const quantity=checked.result.quantity*batches,definition=catalog.find(/* @function crafting.resultDefinition — Inputs: validated catalog definition. Returns exact result identity. */function(item){
      return item.id===checked.result.itemId;
    });
    if(quantity>1000000)throw Error('Crafted output exceeds capacity.');
    root.FrontierHubState.carry(draft,next,{
      itemId:definition.id,quantity,owner:{
        kind:'player'
      },properties:definition.properties||{},questProtected:!!definition.questProtected
    });

    inventory.clear();
    for(const [id,count]of next)inventory.set(id,count);
    store.carried=draft.carried;
    return {
      itemId:definition.id,quantity
    };


  }

  /* @function crafting.merge — Inputs: existing/incoming optional recipes and merged shared catalog. Returns a validated detached union by stable recipe ID. Different definitions under the same ID reject before project import/model adoption; names never overwrite recipes and no incoming records are silently lost. */
  function merge(existing=[],incoming=[],catalog){
    const result=validate(existing,catalog),byId=new Map();
    for(const recipe of result)byId.set(recipe.id,recipe);
    for(const recipe of validate(incoming,catalog)){
      const old=byId.get(recipe.id);
      if(old&&JSON.stringify(old)!==JSON.stringify(recipe))throw Error('Conflicting recipe ID: '+recipe.id+'. Rename the incoming recipe before importing.');
      if(!old){byId.set(recipe.id,recipe);result.push(recipe);}
    }
    return validate(result,catalog);
  }
  root.FrontierCrafting={
    normalize,validate,signature,match,execute,merge
  };


})(typeof window==='undefined'?globalThis:window);
