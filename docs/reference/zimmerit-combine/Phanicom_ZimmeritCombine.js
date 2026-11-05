/*:
 * @target MZ
 * @plugindesc v0.1.3 Zimmerit Combine - 1 to 5 ingredient crafting/combine menu with quantities.
 * @author Phanicom
 *
 * @help
 * ============================================================================
 * PHANICOM ZIMMERIT COMBINE
 * A Phanicom Cohos Cooperation
 * ============================================================================
 *
 * OPENING THE MENU
 * Use the Plugin Command:
 *
 *   Phanicom Zimmerit Combine -> Open Combine Menu
 *
 * Put that command on any workbench, repair table, chemistry station,
 * camp action, terminal, etc.
 *
 * ============================================================================
 * RECIPE NOTE TAGS
 * ============================================================================
 *
 * Put the recipe in the NOTE BOX OF THE RESULT OBJECT.
 *
 * TWO ITEMS:
 *   <PhanicomCombine: i14, i22>
 *
 * QUANTITIES:
 *   <PhanicomCombine: i14x2, i22x1>
 *
 * THREE INGREDIENT TYPES:
 *   <PhanicomCombine: i14, i22, i31>
 *
 * FIVE INGREDIENT TYPES:
 *   <PhanicomCombine: i14x2, i22, i31x3, i44, i57x2>
 *
 * MIXED ITEM / WEAPON / ARMOR:
 *   <PhanicomCombine: w5, a8, i14x2>
 *
 * PREFIXES:
 *   i = Item
 *   w = Weapon
 *   a = Armor
 *
 * No prefix means Item:
 *   <PhanicomCombine: 14, 22>
 *
 * Recipe order does not matter.
 * Recipes are NEVER locked or discovered. If the player has the components
 * and knows the combination, the recipe works.
 *
 * Invalid combinations consume nothing.
 *
 * @param Examples
 * @text Recipe Examples
 * @type multiline_string
 * @default TWO ITEMS:\n<PhanicomCombine: i14, i22>\n\nQUANTITIES:\n<PhanicomCombine: i14x2, i22x1>\n\nBLUEPRINT / RETAINED COMPONENT:\n<PhanicomCombine: $i47, i14x2, i22>\n$i47 is REQUIRED but NOT CONSUMED.\n\nRETAINED QUANTITY:\n<PhanicomCombine: $i47x2, i14x3>\nBoth copies of Item 47 are required and retained.\n\nFIVE INGREDIENTS:\n<PhanicomCombine: i14x2, i22, i31x3, i44, i57x2>\n\nMIXED TYPES:\n<PhanicomCombine: w5, a8, i14x2>
 * @desc Copy/paste reference. Documentation only.
 *
 * @param Title
 * @text Menu Title
 * @type string
 * @default ASSEMBLY UNIT
 *
 * RETAINED COMPONENTS / BLUEPRINTS:
 * Put $ at the START of an ingredient token to require it without consuming it.
 *
 *   <PhanicomCombine: $i47, i14x2, i22>
 *
 * $i47 = Item 47 must be present/selected, but ASSEMBLE keeps it.
 * i14x2 and i22 are consumed normally.
 *
 * Quantities work: $i47x2 requires two copies and retains both.
 * Type prefixes work: $i47, $w5, $a8.
 *
 * Use this for blueprints, reusable tools, manuals, molds, dies,
 * catalysts, authorization objects, or other reusable prerequisites.
 *
 * $ changes CONSUMPTION ONLY. It does not unlock or bypass a recipe.
 * The component must still be placed in COMPONENT REGISTER.
 * Recipes without $ behave exactly as before.
 *
 * @command openCombine
 * @text Open Combine Menu
 * @desc Opens the Zimmerit crafting/combine scene.
 */

(() => {
"use strict";

const PLUGIN_NAME = "Phanicom_ZimmeritCombine";
const P = PluginManager.parameters(PLUGIN_NAME);
const MENU_TITLE = String(P.Title || "ASSEMBLY UNIT");

const PAL = {
    glass:"#b4bea8",
    glass2:"#a4af99",
    ink:"#101610",
    dim:"#566050",
    case:"#070807"
};

const TYPE_ORDER = {i:0,w:1,a:2};

function typeOfObj(obj){
    if(!obj)return null;
    if(DataManager.isItem(obj))return "i";
    if(DataManager.isWeapon(obj))return "w";
    if(DataManager.isArmor(obj))return "a";
    return null;
}

function dbObj(type,id){
    if(type==="i")return $dataItems[id];
    if(type==="w")return $dataWeapons[id];
    if(type==="a")return $dataArmors[id];
    return null;
}

function parseToken(raw){
    // Optional "$" marks a component as required but not consumed.
    const t=String(raw||"").trim().toLowerCase();
    const m=t.match(/^(\$)?\s*([iwa])?\s*(\d+)\s*(?:x\s*(\d+))?$/i);
    if(!m)return null;
    const type=(m[2]||"i").toLowerCase();
    const id=Number(m[3]);
    const qty=Math.max(1,Number(m[4]||1));
    if(!id||!dbObj(type,id))return null;
    return {type,id,qty,keep:!!m[1]};
}

function normalize(list){
    // Merge physical requirements while preserving "$" retention.
    const map=new Map();
    for(const x of list){
        if(!x)continue;
        const k=x.type+":"+x.id;
        if(map.has(k)){
            const old=map.get(k);
            old.qty+=x.qty;
            // If the same object is written both retained and consumed, consumed wins.
            old.keep=old.keep&&!!x.keep;
        }else map.set(k,{type:x.type,id:x.id,qty:x.qty,keep:!!x.keep});
    }
    const out=[...map.values()];
    out.sort((a,b)=>(TYPE_ORDER[a.type]-TYPE_ORDER[b.type])||(a.id-b.id));
    return out;
}

function signature(list){
    return normalize(list).map(x=>`${x.type}${x.id}x${x.qty}`).join("|");
}

function parseRecipe(obj){
    if(!obj||!obj.note)return null;
    const m=obj.note.match(/<PhanicomCombine\s*:\s*([^>]+)>/i);
    if(!m)return null;
    const parts=m[1].split(",").map(parseToken);
    if(parts.some(x=>!x))return null;
    const ingredients=normalize(parts);
    if(ingredients.length<1||ingredients.length>5)return null;
    return {result:obj,ingredients,signature:signature(ingredients)};
}

function collectRecipes(){
    const out=[];
    for(const group of [$dataItems,$dataWeapons,$dataArmors]){
        for(let i=1;i<group.length;i++){
            const r=parseRecipe(group[i]);
            if(r)out.push(r);
        }
    }
    return out;
}

function inventoryObjects(){
    /*
     * STORES intentionally exposes only ordinary RPG Maker MZ Items.
     *
     * DataManager.isItem(obj) excludes Weapons and Armor.
     * itypeId === 1 is RPG Maker MZ's "Regular Item" category, excluding:
     *   - Key Items
     *   - Hidden Item A
     *   - Hidden Item B
     *
     * This filtering affects only what the player can select as a component
     * from the Combine menu. Recipe parsing/output support remains unchanged.
     */
    const out=$gameParty.allItems().filter(o=>
        o &&
        DataManager.isItem(o) &&
        o.itypeId===1 &&
        $gameParty.numItems(o)>0
    );
    out.sort((a,b)=>a.id-b.id);
    return out;
}

PluginManager.registerCommand(PLUGIN_NAME,"openCombine",function(){
    SceneManager.push(Scene_PhanicomCombine);
});

class Scene_PhanicomCombine extends Scene_Base{
    initialize(){
        super.initialize();
        this._recipes=[];
        this._inventory=[];
        this._selected=[];
        this._invIndex=0;
        this._slotIndex=0;
        this._outputIndex=0;
        this._focus="inventory";
        this._flash=0;
        this._flashText="";
        this._finished=false;
    }

    create(){
        super.create();
        this._recipes=collectRecipes();
        this.refreshInventory();
        this.makeCanvas();
        this.makeLayout();
        this.redraw();
    }

    start(){
        super.start();
        Input.clear();
        TouchInput.clear();
    }

    refreshInventory(){
        this._inventory=inventoryObjects();
        this._invIndex=Math.min(this._invIndex,Math.max(0,this._inventory.length-1));
    }

    makeCanvas(){
        this._cw=960; this._ch=540;
        this._canvas=document.createElement("canvas");
        this._canvas.width=this._cw; this._canvas.height=this._ch;
        this._ctx=this._canvas.getContext("2d",{alpha:false});
        this._ctx.imageSmoothingEnabled=false;
        const tex=PIXI.Texture.from(this._canvas);
        tex.baseTexture.scaleMode=PIXI.SCALE_MODES.NEAREST;
        this._screen=new PIXI.Sprite(tex);
        this._screen.anchor.set(.5,.5);
        const s=Math.min(Graphics.width/this._cw,Graphics.height/this._ch);
        this._screen.scale.set(s,s);
        this._screen.position.set(Graphics.width/2,Graphics.height/2);
        this.addChild(this._screen);
    }

    makeLayout(){
        this._layout={
            inv:{x:92,y:132,w:282,h:310},
            slots:{x:402,y:132,w:314,h:310},
            out:{x:742,y:132,w:126,h:310},
            clear:{x:402,y:454,w:88,h:38},
            remove:{x:504,y:454,w:88,h:38},
            assemble:{x:606,y:454,w:110,h:38},
            rows:10
        };
    }

    update(){
        super.update();
        if(this._finished)return;
        this.updateKeys();
        this.updateTouch();
        if(this._flash>0)this._flash--;
        this.redraw();
    }

    updateKeys(){
        if(Input.isTriggered("cancel")){this.finish();return;}

        if(Input.isTriggered("shift")){
            const order=["inventory","slots","output"];
            const i=order.indexOf(this._focus);
            this._focus=order[(i+1)%order.length];
            this.clampOutputIndex();
            SoundManager.playCursor();
        }

        if(this._focus==="inventory"){
            if(Input.isRepeated("up"))this.moveInventory(-1);
            if(Input.isRepeated("down"))this.moveInventory(1);
            if(Input.isTriggered("ok"))this.addCurrent();
        }else if(this._focus==="slots"){
            if(Input.isRepeated("left"))this.moveSlot(-1);
            if(Input.isRepeated("right"))this.moveSlot(1);
            if(Input.isTriggered("ok"))this.removeSelected();
        }else{
            if(Input.isRepeated("up"))this.moveOutput(-1);
            if(Input.isRepeated("down"))this.moveOutput(1);
            if(Input.isTriggered("ok"))this.tryAssemble();
        }

        if(Input.isTriggered("pageup"))this.clearSelected();
        if(Input.isTriggered("pagedown"))this.tryAssemble();
    }

    updateTouch(){
        if(!TouchInput.isTriggered())return;
        const s=this._screen.scale.x;
        const x=(TouchInput.x-this._screen.x)/s+this._cw/2;
        const y=(TouchInput.y-this._screen.y)/s+this._ch/2;

        const vis=this.visibleInventory();
        for(let i=0;i<vis.length;i++){
            const r=this.invRowRect(i);
            if(this.inside(x,y,r)){
                this._invIndex=vis[i].absoluteIndex;
                this._focus="inventory";
                this.addCurrent();
                return;
            }
        }

        for(let i=0;i<5;i++){
            const r=this.slotRect(i);
            if(this.inside(x,y,r)){
                this._slotIndex=i;
                this._focus="slots";
                this.removeSelected();
                return;
            }
        }

        const matches=this.matchingRecipes();
        if(matches.length>1){
            for(let i=0;i<matches.length;i++){
                const r=this.outputRowRect(i);
                if(this.inside(x,y,r)){
                    this._outputIndex=i;
                    this._focus="output";
                    SoundManager.playCursor();
                    return;
                }
            }
        }

        if(this.inside(x,y,this._layout.clear)){this.clearSelected();return;}
        if(this.inside(x,y,this._layout.remove)){this.removeSelected();return;}
        if(this.inside(x,y,this._layout.assemble))this.tryAssemble();
    }

    inside(x,y,r){return x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h;}

    moveInventory(d){
        if(!this._inventory.length)return;
        const n=this._inventory.length;
        this._invIndex=(this._invIndex+d+n)%n;
        SoundManager.playCursor();
    }

    moveSlot(d){
        this._slotIndex=(this._slotIndex+d+5)%5;
        SoundManager.playCursor();
    }

    moveOutput(d){
        const matches=this.matchingRecipes();
        if(matches.length<=1)return;
        this._outputIndex=(this._outputIndex+d+matches.length)%matches.length;
        SoundManager.playCursor();
    }

    clampOutputIndex(){
        const n=this.matchingRecipes().length;
        this._outputIndex=n>0?Math.min(this._outputIndex,n-1):0;
    }

    currentObj(){return this._inventory[this._invIndex]||null;}

    selectedFor(obj){
        if(!obj)return null;
        const t=typeOfObj(obj);
        return this._selected.find(x=>x.type===t&&x.id===obj.id)||null;
    }

    addCurrent(){
        const obj=this.currentObj();
        if(!obj){SoundManager.playBuzzer();return;}
        const t=typeOfObj(obj);
        const owned=$gameParty.numItems(obj);
        const old=this.selectedFor(obj);

        if(old){
            if(old.qty>=owned){
                SoundManager.playBuzzer();
                this.flash("NO MORE AVAILABLE");
                return;
            }
            old.qty++;
            this._outputIndex=0;
            SoundManager.playOk();
            return;
        }

        if(this._selected.length>=5){
            SoundManager.playBuzzer();
            this.flash("FIVE COMPONENT TYPES MAX");
            return;
        }

        this._selected.push({type:t,id:obj.id,qty:1});
        this._slotIndex=this._selected.length-1;
        this._outputIndex=0;
        SoundManager.playOk();
    }

    removeSelected(){
        if(!this._selected.length){SoundManager.playBuzzer();return;}
        if(this._slotIndex>=this._selected.length)this._slotIndex=this._selected.length-1;
        const e=this._selected[this._slotIndex];
        if(!e){SoundManager.playBuzzer();return;}
        if(e.qty>1)e.qty--;
        else this._selected.splice(this._slotIndex,1);
        if(this._slotIndex>=this._selected.length)this._slotIndex=Math.max(0,this._selected.length-1);
        this._outputIndex=0;
        SoundManager.playCancel();
    }

    clearSelected(){
        if(!this._selected.length)return;
        this._selected=[];
        this._slotIndex=0;
        this._outputIndex=0;
        SoundManager.playCancel();
        this.flash("REGISTER CLEARED");
    }

    matchingRecipes(){
        const sig=signature(this._selected);
        if(!sig)return [];
        return this._recipes.filter(r=>r.signature===sig);
    }

    matchingRecipe(){
        const matches=this.matchingRecipes();
        if(!matches.length)return null;
        this._outputIndex=Math.min(this._outputIndex,matches.length-1);
        return matches[this._outputIndex];
    }

    hasIngredients(recipe){
        return recipe.ingredients.every(i=>{
            const obj=dbObj(i.type,i.id);
            return obj&&$gameParty.numItems(obj)>=i.qty;
        });
    }

    tryAssemble(){
        if(!this._selected.length){
            SoundManager.playBuzzer(); this.flash("LOAD COMPONENTS"); return;
        }
        const recipe=this.matchingRecipe();
        if(!recipe){
            SoundManager.playBuzzer(); this.flash("NO VALID ASSEMBLY"); return;
        }
        if(!this.hasIngredients(recipe)){
            SoundManager.playBuzzer(); this.flash("COMPONENT COUNT ERROR"); this.refreshInventory(); return;
        }

        for(const i of recipe.ingredients){
            // "$" components are verified by matching/hasIngredients but retained.
            if(!i.keep)$gameParty.loseItem(dbObj(i.type,i.id),i.qty,false);
        }
        $gameParty.gainItem(recipe.result,1,false);

        this._selected=[];
        this._slotIndex=0;
        this._outputIndex=0;
        this.refreshInventory();
        SoundManager.playOk();
        this.flash(`ASSEMBLED: ${recipe.result.name}`);
    }

    flash(t){this._flashText=String(t);this._flash=90;}

    finish(){
        if(this._finished)return;
        this._finished=true;
        SceneManager.pop();
    }

    visibleInventory(){
        const rows=this._layout.rows,total=this._inventory.length;
        if(!total)return [];
        let start=this._invIndex-Math.floor(rows/2);
        start=Math.max(0,Math.min(start,Math.max(0,total-rows)));
        const out=[];
        for(let i=0;i<rows;i++){
            const ai=start+i;
            if(ai>=total)break;
            out.push({absoluteIndex:ai,obj:this._inventory[ai]});
        }
        return out;
    }

    invRowRect(i){
        const l=this._layout.inv;
        return{x:l.x+8,y:l.y+34+i*26,w:l.w-16,h:23};
    }

    slotRect(i){
        const l=this._layout.slots;
        return{x:l.x+18,y:l.y+44+i*49,w:l.w-36,h:40};
    }

    outputRowRect(i){
        const l=this._layout.out;
        return{x:l.x+7,y:l.y+52+i*35,w:l.w-14,h:30};
    }

    pixel(x,y,color){
        x=Math.round(x); y=Math.round(y);
        if(x<0||y<0||x>=this._cw||y>=this._ch)return;
        this._ctx.fillStyle=color||PAL.ink;
        this._ctx.fillRect(x,y,1,1);
    }

    line(x0,y0,x1,y1,color){
        x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
        const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;
        let err=dx+dy;
        while(true){
            this.pixel(x0,y0,color);
            if(x0===x1&&y0===y1)break;
            const e2=err*2;
            if(e2>=dy){err+=dy;x0+=sx;}
            if(e2<=dx){err+=dx;y0+=sy;}
        }
    }

    rect(x,y,w,h,color){
        this.line(x,y,x+w,y,color);this.line(x+w,y,x+w,y+h,color);
        this.line(x+w,y+h,x,y+h,color);this.line(x,y+h,x,y,color);
    }

    fill(x,y,w,h,color){
        this._ctx.fillStyle=color;
        this._ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
    }

    text(t,x,y,size,color,align="left"){
        const c=this._ctx;
        c.save();
        c.font=`bold ${size}px Courier New, monospace`;
        c.textBaseline="top";c.textAlign=align;c.fillStyle=color||PAL.ink;
        c.fillText(String(t),x,y);
        c.restore();
    }

    button(r,label){
        this.fill(r.x+2,r.y+2,r.w-4,r.h-4,PAL.glass2);
        this.rect(r.x,r.y,r.w,r.h,PAL.ink);
        this.line(r.x+3,r.y+r.h-3,r.x+r.w-3,r.y+r.h-3,PAL.dim);
        this.text(label,r.x+r.w/2,r.y+10,13,PAL.ink,"center");
    }

    redraw(){
        const c=this._ctx,l=this._layout;

        c.fillStyle=PAL.case;c.fillRect(0,0,this._cw,this._ch);
        c.fillStyle=PAL.glass;c.fillRect(70,46,820,438);
        c.fillStyle="rgba(0,0,0,.035)";
        for(let y=49;y<484;y+=4)c.fillRect(70,y,820,1);

        this.rect(70,46,820,438,PAL.ink);
        this.rect(78,54,804,422,PAL.dim);

        this.fill(92,68,776,42,PAL.glass2);
        this.rect(92,68,776,42,PAL.ink);

        for(let i=0;i<16;i++){
            const x=104+i*18,h=i%4===0?10:(i%2?4:7);
            this.line(x,77,x,77+h,PAL.ink);
        }
        for(let i=0;i<15;i++){
            const x=610+i*17,h=i%3===0?9:5;
            this.line(x,101,x,101-h,PAL.ink);
        }

        this.text(MENU_TITLE,480,79,21,PAL.ink,"center");

        // STORES
        this.text("STORES",l.inv.x,118,13,PAL.ink);
        this.rect(l.inv.x,l.inv.y,l.inv.w,l.inv.h,PAL.ink);

        const vis=this.visibleInventory();
        if(!vis.length)this.text("NO COMPONENTS",l.inv.x+14,l.inv.y+40,12,PAL.dim);

        for(let i=0;i<vis.length;i++){
            const e=vis[i],obj=e.obj,r=this.invRowRect(i);
            const sel=this._focus==="inventory"&&e.absoluteIndex===this._invIndex;
            if(sel)this.fill(r.x,r.y,r.w,r.h,PAL.ink);
            const col=sel?PAL.glass:PAL.ink;
            const typ=typeOfObj(obj)==="i"?"I":typeOfObj(obj)==="w"?"W":"A";
            this.text(typ,r.x+5,r.y+4,10,sel?PAL.glass:PAL.dim);
            this.text(obj.name,r.x+22,r.y+3,12,col);
            this.text(`x${$gameParty.numItems(obj)}`,r.x+r.w-6,r.y+3,11,col,"right");
        }

        // COMPONENT REGISTER
        this.text("COMPONENT REGISTER",l.slots.x,118,13,PAL.ink);
        this.rect(l.slots.x,l.slots.y,l.slots.w,l.slots.h,PAL.ink);

        for(let i=0;i<5;i++){
            const r=this.slotRect(i),sel=this._focus==="slots"&&i===this._slotIndex;
            if(sel)this.fill(r.x,r.y,r.w,r.h,PAL.ink);
            this.rect(r.x,r.y,r.w,r.h,PAL.dim);
            this.text(String(i+1).padStart(2,"0"),r.x+8,r.y+12,10,sel?PAL.glass:PAL.dim);
            const ing=this._selected[i];
            if(ing){
                const obj=dbObj(ing.type,ing.id);
                this.text(obj?obj.name:"INVALID",r.x+38,r.y+8,13,sel?PAL.glass:PAL.ink);
                this.text(`x${ing.qty}`,r.x+r.w-10,r.y+8,13,sel?PAL.glass:PAL.ink,"right");
            }else{
                this.text("EMPTY",r.x+38,r.y+8,12,sel?PAL.glass:PAL.dim);
            }
        }

        // OUTPUT
        this.text("OUTPUT",l.out.x,118,13,PAL.ink);
        this.rect(l.out.x,l.out.y,l.out.w,l.out.h,PAL.ink);

        const matches=this.matchingRecipes();
        this.clampOutputIndex();
        const recipe=matches.length?matches[this._outputIndex]:null;

        if(matches.length===1){
            this.text("MATCH",l.out.x+l.out.w/2,l.out.y+26,12,PAL.dim,"center");
            this.text(recipe.result.name,l.out.x+l.out.w/2,l.out.y+72,12,PAL.ink,"center");
            this.rect(l.out.x+24,l.out.y+122,l.out.w-48,76,PAL.ink);
            this.text("READY",l.out.x+l.out.w/2,l.out.y+148,14,PAL.ink,"center");
        }else if(matches.length>1){
            this.text(`${matches.length} OPTIONS`,l.out.x+l.out.w/2,l.out.y+20,10,PAL.dim,"center");
            for(let i=0;i<matches.length;i++){
                const r=this.outputRowRect(i);
                const sel=i===this._outputIndex;
                if(sel)this.fill(r.x,r.y,r.w,r.h,PAL.ink);
                this.rect(r.x,r.y,r.w,r.h,PAL.dim);
                this.text(matches[i].result.name,r.x+r.w/2,r.y+8,10,sel?PAL.glass:PAL.ink,"center");
            }
        }else{
            this.text("NO MATCH",l.out.x+l.out.w/2,l.out.y+32,12,PAL.dim,"center");
            this.text("?",l.out.x+l.out.w/2,l.out.y+120,42,PAL.dim,"center");
        }

        this.button(l.clear,"CLR");
        this.button(l.remove,"DEL");
        this.button(l.assemble,"ASSEMBLE");

        let status=this._flash>0?this._flashText:(recipe?"VALID ASSEMBLY / EXECUTE":"SELECT STORES / LOAD COMPONENTS");
        this.line(92,500,868,500,PAL.dim);
        this.text(status,92,506,11,PAL.dim);
        this.text("ESC EXIT   SHIFT FOCUS   PGUP CLR   PGDN ASSEMBLE",868,506,9,PAL.dim,"right");

        if(this._screen&&this._screen.texture&&this._screen.texture.baseTexture)this._screen.texture.baseTexture.update();
    }

    terminate(){
        if(this._screen){
            const t=this._screen.texture;
            this.removeChild(this._screen);
            this._screen.destroy();
            if(t)t.destroy(true);
            this._screen=null;
        }
        super.terminate();
    }
}

window.Scene_PhanicomCombine=Scene_PhanicomCombine;
})();
