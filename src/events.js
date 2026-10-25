/* MAINTAINER GUIDE
 * MZ-inspired page conditions and a bounded command interpreter. Highest matching page wins; all conditions on it must pass. Each playtest clones authored events. Add commands to validation and execution together.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function (root) {
'use strict'  ;
  const graphics = ['npc', 'chest', 'openChest', 'marker'];
  const triggers = ['interact', 'playerTouch', 'autorun', 'parallel'];
  const validName = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,60}$/.test(value);
  const point = value => value && Number.isFinite(value.x) && Number.isFinite(value.y) && value.x >= 1 && value.y >= 1 && value.x <= 47 && value.y <= 47;
// Construct a new page with explicit defaults, including one demonstration message.
  function page(name = 'Page 1') {
    return {
      name, graphic: 'npc', trigger: 'interact', solid: false, condition: {
        type: 'always', key: ''
      }
      , commands: [{
        type: 'message', text: 'Hello, wanderer.'
      }
      ]
    }
    ;
  }
// Construct isolated editor/event state through the caller services.
  function create(id, x, y) {
    return {
      id, name: 'New event', x, y, range: 1.8, inspection: '', pages: [page()]
    }
    ;
  }
// Sanitize one page condition; variable/item conditions are numeric thresholds and self-switches are A through D.
  function checkCondition(c){
    if(!c||!['always','selfSwitch','switch','variable','item'].includes(c.type))throw Error('Invalid page condition.');
    if(c.type==='selfSwitch'&&!['A','B','C','D'].includes(c.key))throw Error('Self switch must be A–D.');
    if(['switch','variable','item'].includes(c.type)&&!validName(c.key))throw Error('Invalid condition key.');
    if(['variable','item'].includes(c.type)&&!Number.isFinite(c.value))throw Error('Condition requires a number.');
    return {
      type:c.type,key:c.type==='always'?'':c.key,...(['variable','item'].includes(c.type)?{
        value:c.value
      }
      :{
      }
      )
    }
    ;
  }
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  function validate(events, reserved = new Set()) {
    if (!Array.isArray(events) || events.length > 200) throw Error('At most 200 events are supported.');
    const ids = new Set(reserved);
    return events.map(event => {
      if (!event || !validName(event.id) || ids.has(event.id) || !point(event) || typeof event.name !== 'string' || event.name.length > 80 || !Number.isFinite(event.range) || event.range < .5 || event.range > 5 || !Array.isArray(event.pages) || !event.pages.length || event.pages.length > 12) throw Error('Invalid event identity, position, range or pages.');
      ids.add(event.id);
      if(event.topics!==undefined)root.FrontierParser?.compile(event.topics);
      if(event.spriteProfile!==undefined&&(typeof event.spriteProfile!=='string'||event.spriteProfile.length>100))throw Error('Invalid sprite profile.');
      if(event.combatNote!==undefined&&(typeof event.combatNote!=='string'||event.combatNote.length>2000))throw Error('Invalid combat note.');
      if(event.inspection!==undefined&&(typeof event.inspection!=='string'||event.inspection.length>2000))throw Error('Invalid inspection text.');
      return {
        ...(event.topics?{
          topics:structuredClone(event.topics)
        }
        :{
        }
        ),...(event.spriteProfile?{
          spriteProfile:event.spriteProfile
        }
        :{
        }
        ),...(event.combatNote?{
          combatNote:event.combatNote
        }
        :{
        }
        ),id: event.id, name: event.name, x: event.x, y: event.y, elevation: Number.isInteger(event.elevation??0)&&Math.abs(event.elevation??0)<=100?(event.elevation??0):(()=>{throw Error('Invalid event elevation.');})(), range: event.range, ...(event.inspection===undefined?{
        }
        :{
          inspection:event.inspection
        }
        ), pages: event.pages.map(p => {
          if (!p || typeof p.name !== 'string' || p.name.length > 80 || !graphics.includes(p.graphic) || !triggers.includes(p.trigger) || typeof p.solid !== 'boolean' || !p.condition || !['always', 'selfSwitch', 'switch','variable','item'].includes(p.condition.type) || !Array.isArray(p.commands) || p.commands.length > 64) throw Error('Invalid event page.');
          const condition = checkCondition(p.condition);
          if(p.movement!==undefined&&!['stationary','random','approach'].includes(p.movement))throw Error('Unknown event movement.');
          if(p.priority!==undefined&&!['below','normal','above'].includes(p.priority))throw Error('Unknown event priority.');
          if(p.conditions!==undefined&&(!Array.isArray(p.conditions)||p.conditions.length>8))throw Error('At most eight additional conditions.');
          const conditions=p.conditions?.map(checkCondition);
          if (condition.type === 'selfSwitch' && !['A', 'B', 'C', 'D'].includes(condition.key)) throw Error('Self switch must be A–D.');
          if (condition.type === 'switch' && !validName(condition.key)) throw Error('Invalid switch name.');
          const commands = p.commands.map(command => {
            if (!command) throw Error('Invalid event command.');
            switch (command.type) {
              case 'variable':
              if(!validName(command.key)||!['set','add'].includes(command.operation)||!Number.isFinite(command.value))throw Error('Invalid variable command.');
              return {
                type:command.type,key:command.key,operation:command.operation,value:command.value
              }
              ;
              case 'message':
              if (typeof command.text !== 'string' || command.text.length > 1500) throw Error('Message must be at most 1500 characters.');
              return {
                type: 'message', text: command.text, ...(command.dialogue?{dialogue:true}:{})
              }
              ;
              case 'selfSwitch':
              if (!['A', 'B', 'C', 'D'].includes(command.key) || typeof command.value !== 'boolean') throw Error('Invalid self-switch command.');
              return {
                type: command.type, key: command.key, value: command.value
              }
              ;
              case 'switch':
              if (!validName(command.key) || typeof command.value !== 'boolean') throw Error('Invalid switch command.');
              return {
                type: command.type, key: command.key, value: command.value
              }
              ;
              case 'giveItem':
              if (!validName(command.item) || !Number.isInteger(command.amount) || command.amount < 1 || command.amount > 999) throw Error('Invalid item command.');
              return {
                type: command.type, item: command.item, amount: command.amount
              }
              ;
              case 'wait':
              if (!Number.isFinite(command.seconds) || command.seconds < 0 || command.seconds > 30) throw Error('Wait must be 0–30 seconds.');
              return {
                type: command.type, seconds: command.seconds
              }
              ;
              case 'transfer':
              if (!point(command)) throw Error('Transfer is outside the level.');
              return {
                type: command.type, x: command.x, y: command.y
              }
              ;
              case 'choices':
              if(!validName(command.key)||!Array.isArray(command.options)||command.options.length<2||command.options.length>8||command.options.some(s=>typeof s!=='string'||!s.trim()||s.length>120))throw Error('Choices need 2–8 labels and a result variable.');
              return {type:'choices',key:command.key,options:[...command.options]};
              case 'branch': return {type:'branch',condition:checkCondition(command.condition)};
              case 'else': case 'end': return {type:command.type};
              default: throw Error('Unknown event command.');
            }
          }
          );
          // Flat branch markers match the familiar indented MZ command list.
          const stack=[];
          for(const c of commands){if(c.type==='branch'){if(stack.length>=8)throw Error('At most eight nested branches.');stack.push(false);}if(c.type==='else'){if(!stack.length||stack.at(-1))throw Error('Unmatched or duplicate Else.');stack[stack.length-1]=true;}if(c.type==='end'){if(!stack.length)throw Error('Unmatched End.');stack.pop();}}
          if(stack.length)throw Error('Every branch needs an End.');
          return {
            name: p.name, graphic: p.graphic, trigger: p.trigger, solid: p.solid, movement:p.movement||'stationary',priority:p.priority||'normal',through:!!p.through, condition, ...(conditions?{
              conditions
            }
            :{
            }
            ), commands
          }
          ;
        }
        )
      }
      ;
    }
    );
  }
// Walk pages backwards and select the highest page whose primary and additional conditions all match.
  function activePage(event, state) {
    for (let i = event.pages.length - 1;
    i >= 0;
    i--) {
      const matches=c=>c.type==='always'||(c.type==='selfSwitch'&&state.selfSwitches.get(event.id+':'+c.key)===true)||(c.type==='switch'&&state.switches.get(c.key)===true)||(c.type==='variable'&&(state.variables?.get(c.key)||0)>=c.value)||(c.type==='item'&&(state.inventory.get(c.key)||0)>=c.value);
      if([event.pages[i].condition,...(event.pages[i].conditions||[])].every(matches))return i;
    }
    return -1;
  }
// Clone authored events and own temporary switches, inventory, variable values and interpreter state.
  function createSession(authoredEvents, services) {
    const events = structuredClone(authoredEvents);
    const state = {
      selfSwitches: new Map(), switches: new Map(), inventory: new Map(), variables: new Map()
    }
    ;
    const touched = new Set();
    const wander=new Map();
    let execution = null, message = null, waiting = 0, automaticCursor=0;
    // Skip to the matching Else/End while respecting nested branches.
    function skipBranch(allowElse){let depth=0;while(execution.index<execution.commands.length){const c=execution.commands[execution.index++];if(c.type==='branch')depth++;else if(c.type==='end'){if(!depth)return;depth--;}else if(c.type==='else'&&!depth&&allowElse)return;}}
// Start an eligible event only when no other event is running and the selected page trigger matches.
    function start(event, trigger) {
      if (execution) return false;
      const index = activePage(event, state);
      if (index < 0 || event.pages[index].trigger !== trigger) return false;
      execution = {
        eventId: event.id, name: event.name, pageIndex:index, trigger, commands: structuredClone(event.pages[index].commands), index: 0
      }
      ;
      return true;
    }
    function update(dt, player) {
      // Only moving pages need motion work. Positions belong to the isolated
      // session; authoring positions remain unchanged after a playtest.
      for(const event of events){const p=event.pages[activePage(event,state)];if(!p||!p.movement||p.movement==='stationary')continue;
        let direction;
        if(p.movement==='approach')direction={x:player.x-event.x,y:player.y-event.y};
        else{direction=wander.get(event.id);if(!direction||direction.time<=0){const a=Math.random()*Math.PI*2;direction={x:Math.cos(a),y:Math.sin(a),time:2};wander.set(event.id,direction);}direction.time-=dt;}
        const length=Math.hypot(direction.x,direction.y);if(length<.5&&p.movement==='approach')continue;const x=event.x+direction.x/(length||1)*.5*dt,y=event.y+direction.y/(length||1)*.5*dt;
        if(x>=1&&y>=1&&x<=47&&y<=47&&(p.through||services.canStand(x,y,event.id))){event.x=x;event.y=y;}
      }
      if (execution) {
        if (message) return;
        waiting = Math.max(0, waiting - dt);
        if (waiting > 0) return;
        for (let budget = 0;
        execution && budget < 64;
        budget++) {
          const command = execution.commands[execution.index++];
          if (!command) {
            execution = null;
            break;
          }
          if (command.type === 'message') {
            message = {
              name: execution.name, text: command.text, dialogue:command.dialogue
            }
            ;
            if(services.message(message)===true){
              message=null;
              continue;
            }
            return;
          }
          if(command.type==='choices'){
            message={name:execution.name,text:'Choose:',options:command.options,key:command.key,dialogue:true};services.message(message);return;
          }
          if(command.type==='branch'){
            const test={id:execution.eventId,pages:[{condition:command.condition}]};
            if(activePage(test,state)<0)skipBranch(true);
          }
          if(command.type==='else')skipBranch(false);
          if (command.type === 'selfSwitch') state.selfSwitches.set(execution.eventId + ':' + command.key, command.value);
          if (command.type === 'switch') state.switches.set(command.key, command.value);
          if(command.type==='variable')state.variables.set(command.key,command.operation==='add'?(state.variables.get(command.key)||0)+command.value:command.value);
          if (command.type === 'giveItem') {
            state.inventory.set(command.item, (state.inventory.get(command.item) || 0) + command.amount);
            services.item?.(command.item, command.amount);
            services.log('Received ' + command.amount + ' × ' + command.item + '.');
          }
          if (command.type === 'wait') {
            waiting = command.seconds;
            if (waiting) return;
          }
          if (command.type === 'transfer') {
            if (services.canStand(command.x, command.y)) {
              player.x = command.x;
              player.y = command.y;
              player.vx = player.vy = player.walkTime = 0;
            }
            else services.log('Event transfer destination is blocked.');
          }
        }
      }
      // Round-robin automatic scheduling prevents the first parallel event
      // starving other automatic pages. A single interpreter limits work.
      if(!execution)for(let n=0;n<events.length;n++){const i=(automaticCursor+n)%events.length,event=events[i],index=activePage(event,state),trigger=event.pages[index]?.trigger;if(trigger==='autorun'||trigger==='parallel'){start(event,trigger);automaticCursor=(i+1)%events.length;break;}}
      for (const event of events) {
        const pageIndex=activePage(event,state),trigger=event.pages[pageIndex]?.trigger;
        // One bounded interpreter, one automatic start per update; commands
        // cannot create an unbounded synchronous autorun/parallel loop.
        const inside = Math.hypot(event.x - player.x, event.y - player.y) <= .65 && Math.abs((player.z||0)-(player.groundZ||0))<.65;
        if (inside && !touched.has(event.id) && !execution) start(event, 'playerTouch');
        if (inside) touched.add(event.id);
        else touched.delete(event.id);
      }
    }
    return {
      events, state, activePage: event => activePage(event, state), start, update,
      choose(index){if(!message?.options||!Number.isInteger(index)||index<0||index>=message.options.length)return;state.variables.set(message.key,index+1);message=null;services.message(null);},
      debug(){return {execution:execution?{eventId:execution.eventId,page:execution.pageIndex+1,command:execution.index,trigger:execution.trigger}:null,waiting,message:message?.text,switches:[...state.switches],variables:[...state.variables],selfSwitches:[...state.selfSwitches],pages:events.map(e=>({id:e.id,name:e.name,activePage:activePage(e,state)+1,conditions:e.pages.map((p,i)=>({page:i+1,passes:activePage({id:e.id,pages:[p]},state)>=0,conditions:[p.condition,...(p.conditions||[])]}))}))};},
      next() {
        if(message?.options)return;
        message = null;
        services.message(null);
      }
      ,
      get busy() {
        return !!message||!!execution&&execution.trigger!=='parallel';
      }
      , get message() {
        return message;
      }
    }
    ;
  }
  root.FrontierEvents = {
    create, page, validate, activePage, createSession, graphics
  }
  ;
}
)(typeof window === 'undefined' ? globalThis : window);
