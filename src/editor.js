/* MAINTAINER GUIDE
 * In-level editor forms. The injected API owns mutation, validation, undo and restart. This module edits authored event data, never the active combat copy. Add a command in fields, addCommand, summary and events.js together.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function (root) {
'use strict'  ;
  const $ = id => document.getElementById(id);
// Construct isolated editor/event state through the caller services.
  function create(api) {
    let selectedId = '', pageIndex = 0, commandIndex = null;
    const selected = () => [...api.world().objects, ...(api.world().events || [])].find(e => e.id === selectedId);
// Exit command-edit mode and rebuild input fields with defaults.
    function resetCommand(){
      commandIndex=null;
      $('addCommand').textContent='Add command';
      fields();
    }
// Change selection and reset page/command editing to avoid applying controls to the wrong event.
    function choose(id) {
      selectedId = id;
      pageIndex = 0;
      resetCommand();
      refresh();
      api.preview();
    }
// Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range.
    function refresh() {
      const world = api.world(), all = [...world.objects, ...(world.events || [])];
      $('selection').replaceChildren(new Option('None', ''), ...all.map(e => new Option((e.name || e.id) + (e.pages ? ' [event]' : ' [' + e.kind + ']'), e.id)));
      $('selection').value = selectedId;
      const event = selected();
      $('objectX').value = event?.x.toFixed(2) || '';
      $('objectY').value = event?.y.toFixed(2) || '';
      $('objectElevation').value=event?.elevation||0;
      $('openEventEditor').disabled=!event?.pages;
      $('eventInspector').hidden = !event?.pages;
      if (!event?.pages) return;
      pageIndex = Math.min(pageIndex, event.pages.length - 1);
      $('eventPage').replaceChildren(...event.pages.map((p, i) => new Option((i + 1) + ' · ' + p.name, String(i))));
      $('eventPage').value = String(pageIndex);
      const page = event.pages[pageIndex];
      $('eventTopics').value=JSON.stringify(event.topics||[],null,2);
      $('eventSprite').value=event.spriteProfile||'';
      $('eventCombat').value=event.combatNote||'';
      $('eventName').value = event.name;
      $('eventRange').value = +(event.range/.3).toFixed(2);
      $('inspectionText').value=event.inspection||'';
      $('pageName').value = page.name;
      $('pageCondition').value = page.condition.type;
      $('conditionValue').value=page.condition.value??1;
      $('additionalConditions').value=(page.conditions||[]).map(c=>[c.type,c.key,...(c.value===undefined?[]:[c.value])].join(':')).join('\n');
      $('conditionKey').value = page.condition.key || 'A';
      $('pageGraphic').value = page.graphic;
      $('pageTrigger').value = page.trigger;
      $('pageSolid').checked = page.solid;
      if($('pageMovement')){$('pageMovement').value=page.movement||'stationary';$('pagePriority').value=page.priority||'normal';$('pageThrough').checked=!!page.through;}
      const list = $('commandList');
      list.replaceChildren();
      let depth=0;
      page.commands.forEach((command, i) => {
        const li = document.createElement('li'), text = document.createElement('span');
        if(command.type==='end'||command.type==='else')depth=Math.max(0,depth-1);
        li.style.marginLeft=(depth*16)+'px';
        if(command.type==='branch'||command.type==='else')depth++;
        text.textContent = summary(command);
        li.append(text);
        const edit=document.createElement('button');
        edit.textContent='Edit';
        edit.onclick=()=>{
          commandIndex=i;
          $('commandType').value=command.type;
          fields();
          $('addCommand').textContent='Update command';
          const values={
            cmdOptions:command.options?.join('\n'),cmdConditionType:command.condition?.type,cmdOperation:command.operation,cmdNumber:command.condition?.value??command.value,cmdText:command.text,cmdKey:command.condition?.key??command.key,cmdValue:String(command.value),cmdItem:command.item,cmdAmount:command.amount,cmdSeconds:command.seconds,cmdX:command.x,cmdY:command.y
          }
          ;
          for(const [id,value] of Object.entries(values))if($(id)&&value!==undefined)$(id).value=value;
          if($('cmdDialogue'))$('cmdDialogue').checked=!!command.dialogue;
        }
        ;
        li.append(edit);
        for (const [label, action] of [['↑', () => {
          if (i > 0) [page.commands[i - 1], page.commands[i]] = [page.commands[i], page.commands[i - 1]];
        }
        ], ['↓', () => {
          if (i < page.commands.length - 1) [page.commands[i + 1], page.commands[i]] = [page.commands[i], page.commands[i + 1]];
        }
        ], ['Delete', () => page.commands.splice(i, 1)]]) {
          const button = document.createElement('button');
          button.textContent = label;
          button.onclick = () => api.mutate(() => {
            action();
          }
          , () => {
            resetCommand();
            refresh();
          }
          );
          li.append(button);
        }
        list.append(li);
      }
      );
    }
// Produce a readable command label for the editor list. Add a branch when introducing a command type.
    function summary(c) {
      if(c.type==='choices')return 'Show choices: '+c.options.join(' / ')+' → '+c.key;
      if(c.type==='branch')return 'If '+c.condition.type+' '+c.condition.key+' '+(c.condition.value??'ON');
      if(c.type==='else'||c.type==='end')return c.type==='else'?'Else':'End branch';
      if(c.type==='variable')return 'Variable '+c.key+' '+c.operation+' '+c.value;
      if (c.type === 'message') return 'Show message: ' + c.text;
      if (c.type === 'selfSwitch' || c.type === 'switch') return (c.type === 'selfSwitch' ? 'Self switch ' : 'Global switch ') + c.key + ' → ' + (c.value ? 'ON' : 'OFF');
      if (c.type === 'giveItem') return 'Give ' + c.amount + ' × ' + c.item;
      if (c.type === 'wait') return 'Wait ' + c.seconds + ' seconds';
      return 'Transfer to ' + c.x + ', ' + c.y;
    }
// Create the controls needed by the selected command type; these values are converted and validated on apply.
    function fields() {
      const type = $('commandType').value, holder = $('commandFields');
      holder.replaceChildren();
// Build a labeled form control for the current command, keeping IDs aligned with addCommand.
      function input(id, label, value, kind = 'text') {
        const l = document.createElement('label'), e = document.createElement(kind === 'textarea' ? 'textarea' : 'input');
        l.textContent = label;
        e.id = id;
        if (kind !== 'textarea') e.type = kind;
        e.value = value;
        l.append(e);
        holder.append(l);
      }
      if(type==='variable'){
        input('cmdKey','Variable name','progress');
        input('cmdOperation','Operation (set or add)','set');
        input('cmdNumber','Value',1,'number');
      }
      if(type==='message'){input('cmdText','Dialogue text','Hello, wanderer.','textarea');const label=document.createElement('label');label.innerHTML='<input id="cmdDialogue" type="checkbox" checked> Conversation (wait for Continue)';holder.append(label);}
      if(type==='choices'){input('cmdKey','Result variable (1-based choice index)','answer');input('cmdOptions','Choices, one per line','Yes\nNo','textarea');}
      if(type==='branch'){input('cmdConditionType','Condition','variable');const old=$('cmdConditionType'),select=document.createElement('select');select.id=old.id;for(const k of ['switch','selfSwitch','variable','item'])select.append(new Option(k,k));select.value='variable';old.replaceWith(select);input('cmdKey','Condition key','answer');input('cmdNumber','Minimum value',2,'number');}
      if (type === 'selfSwitch' || type === 'switch') {
        input('cmdKey', 'Switch key', type === 'selfSwitch' ? 'A' : 'opened');
        const l = document.createElement('label'), s = document.createElement('select');
        l.textContent = 'Value';
        s.id = 'cmdValue';
        s.append(new Option('ON', 'true'), new Option('OFF', 'false'));
        l.append(s);
        holder.append(l);
      }
      if (type === 'giveItem') {
        input('cmdItem', 'Item ID (ammo9 adds reserve rounds)', 'ammo9');
        input('cmdAmount', 'Amount', '12', 'number');
      }
      if (type === 'wait') input('cmdSeconds', 'Seconds', '1', 'number');
      if (type === 'transfer') {
        input('cmdX', 'Destination X', '24', 'number');
        input('cmdY', 'Destination Y', '24', 'number');
      }
    }
    $('selection').onchange = () => choose($('selection').value);
    $('eventPage').onchange = () => {
      pageIndex = Number($('eventPage').value);
      resetCommand();
      refresh();
      api.preview();
    }
    ;
    $('applyPosition').onclick = () => {
      const e = selected();
      if(e){const x=Number($('objectX').value),y=Number($('objectY').value),elevation=Number($('objectElevation').value);api.mutate(()=>{e.x=x;e.y=y;e.elevation=elevation;},refresh);}
    }
    ;
    $('deleteSelected').onclick = () => {
      if (selected()) api.remove(selectedId);
    }
    ;
    // Serialize page controls back into authored data through the application's validation/undo transaction.
    $('savePage').onclick = () => {
      const e = selected();
      if (!e?.pages) return;
      api.mutate(() => {
        e.topics=JSON.parse($('eventTopics').value||'[]');
        FrontierParser.compile(e.topics);
        e.spriteProfile=$('eventSprite').value;
        e.combatNote=$('eventCombat').value;
        e.name = $('eventName').value;
        e.range = Math.max(.5,Math.min(5,Number($('eventRange').value)*.3));
        e.inspection=$('inspectionText').value;
        const p = e.pages[pageIndex];
        p.name = $('pageName').value;
        p.graphic = $('pageGraphic').value;
        p.trigger = $('pageTrigger').value;
        p.solid = $('pageSolid').checked;
        p.movement=$('pageMovement').value;p.priority=$('pagePriority').value;p.through=$('pageThrough').checked;
        p.condition = {
          type: $('pageCondition').value, key: $('pageCondition').value === 'always' ? '' : $('conditionKey').value,...(['variable','item'].includes($('pageCondition').value)?{
            value:Number($('conditionValue').value)
          }
          :{
          }
          )
        }
        ;
        p.conditions=$('additionalConditions').value.split(/\n/).filter(s=>s.trim()).map(s=>{
          const [type,key,value]=s.trim().split(':');
          return {
            type,key,...(['variable','item'].includes(type)?{
              value:Number(value)
            }
            :{
            }
            )
          }
          ;
        }
        );
      }
      , refresh);
    }
    ;
    // Deep-copy page commands/conditions; a shallow copy would make edits affect both pages.
    $('copyPage').onclick=()=>{
      const e=selected();
      if(!e?.pages||e.pages.length>=12)return;
      api.mutate(()=>{
        const p=structuredClone(e.pages[pageIndex]);
        p.name+=' copy';
        e.pages.splice(pageIndex+1,0,p);
        pageIndex++;
      }
      ,refresh);
    }
    ;
    $('addPage').onclick = () => {
      const e = selected();
      if (!e?.pages) return;
      api.mutate(() => {
        e.pages.push(FrontierEvents.page('Page ' + (e.pages.length + 1)));
        pageIndex = e.pages.length - 1;
      }
      , refresh);
    }
    ;
    $('removePage').onclick = () => {
      const e = selected();
      if (!e?.pages || e.pages.length < 2) return;
      api.mutate(() => e.pages.splice(pageIndex, 1), refresh);
    }
    ;
    $('commandType').onchange = resetCommand;
    // Build a whitelisted command from typed fields; validation in events.js rejects unsupported values.
    $('addCommand').onclick = () => {
      const e = selected();
      if (!e?.pages) return;
      const type = $('commandType').value;
      let command = {
        type
      }
      ;
      if(type==='variable'){
        command.key=$('cmdKey').value;
        command.operation=$('cmdOperation').value;
        command.value=Number($('cmdNumber').value);
      }
      if(type==='message'){command.text=$('cmdText').value;command.dialogue=$('cmdDialogue').checked;}
      if(type==='choices'){command.key=$('cmdKey').value;command.options=$('cmdOptions').value.split(/\n/).map(s=>s.trim()).filter(Boolean);}
      if(type==='branch'){command.condition={type:$('cmdConditionType').value,key:$('cmdKey').value,...(['variable','item'].includes($('cmdConditionType').value)?{value:Number($('cmdNumber').value)}:{})};}
      if (type === 'selfSwitch' || type === 'switch') {
        command.key = $('cmdKey').value;
        command.value = $('cmdValue').value === 'true';
      }
      if (type === 'giveItem') {
        command.item = $('cmdItem').value;
        command.amount = Number($('cmdAmount').value);
      }
      if (type === 'wait') command.seconds = Number($('cmdSeconds').value);
      if (type === 'transfer') {
        command.x = Number($('cmdX').value);
        command.y = Number($('cmdY').value);
      }
      api.mutate(() => {
        if(commandIndex===null){const i=workbench.selectedIndex();e.pages[pageIndex].commands.splice(i<0?e.pages[pageIndex].commands.length:i,0,command,...(type==='branch'?[{type:'end'}]:[]));}
        else e.pages[pageIndex].commands[commandIndex]=command;
      }
      ,()=>{
        resetCommand();
        refresh();
      }
      );
    }
    ;
    fields();
    const workbench=FrontierWorkbench.create({api,selected,refresh,choose,page:()=>pageIndex,setPage:i=>{pageIndex=i;resetCommand();refresh();api.preview();}});
    return {
      openEvent:workbench.open,
      choose, refresh, selected, get selectedId() {
        return selectedId;
      }
      , get pageIndex() {
        return pageIndex;
      }
    }
    ;
  }
  root.FrontierEditor = {
    create
  }
  ;
}
)(window);
