/* Dedicated event workbench. Reuses validated editor forms; it never mutates
 * runtime events. Clipboard/template changes go through the undo transaction.
 * Debug snapshots are sampled only while visible, outside the gameplay loop. */
(function(root){'use strict';
  function create({api,selected,refresh,choose,page,setPage}){
    const $=id=>document.getElementById(id),dialog=document.createElement('dialog');dialog.id='eventWorkbench';
    dialog.innerHTML='<header><h2>Event editor</h2><button id="closeEventWindow">Close</button></header><nav id="eventTabs" aria-label="Event pages"></nav><div class="eventToolbar"><button id="clipboardPage">Copy page to clipboard</button><button id="pastePage">Paste page</button><button id="copyCommand">Copy command</button><button id="pasteCommand">Paste command before selection</button><button id="testEvent">Test this event</button><button id="saveEventTemplate">Save template</button><select id="eventTemplates"><option value="">Choose template</option></select><button id="placeEventTemplate">Place template</button></div><div class="eventColumns"><section id="eventProperties"></section><section id="eventCommands"><h3>Contents</h3></section></div><details><summary>Event debugger</summary><pre id="eventDebugger"></pre></details>';
    document.body.append(dialog);const inspector=$('eventInspector');$('eventProperties').append(inspector);
    // Keep page conditions/appearance above advanced plugin/topic data, as in
    // MZ's page-oriented inspector. Advanced text remains an optional escape hatch.
    const advanced=document.createElement('details');advanced.innerHTML='<summary>Advanced NPC topics and combat</summary>';
    for(const id of ['eventTopics','eventSprite','eventCombat'])advanced.append($(id).closest('label'));
    inspector.append(advanced);$('eventPage').closest('label').hidden=true;
    const options=document.createElement('fieldset');options.innerHTML='<legend>Movement and priority</legend><label>Autonomous movement<select id="pageMovement"><option value="stationary">Stationary</option><option value="random">Random walk</option><option value="approach">Approach player</option></select></label><label>Priority<select id="pagePriority"><option value="below">Below characters</option><option value="normal">Same as characters</option><option value="above">Above characters</option></select></label><label><input id="pageThrough" type="checkbox"> Through (ignore blocking)</label>';$('pageSolid').closest('label').after(options);
    for(const id of ['commandList','commandType','commandFields','addCommand']){const el=$(id);$('eventCommands').append(id==='commandType'?el.closest('label'):el);}
    const returnButton=document.createElement('button');returnButton.id='returnEventTest';returnButton.textContent='Return to event editor';returnButton.hidden=true;document.body.append(returnButton);
    let pageClipboard=null,commandClipboard=null,commandSelection=-1,timer=null;
    function tabs(){const e=selected();$('eventTabs').replaceChildren();for(const [i,p]of(e?.pages||[]).entries()){const b=document.createElement('button');b.textContent=(i+1)+' · '+p.name;b.setAttribute('aria-pressed',String(i===page()));b.onclick=()=>{setPage(i);tabs();};$('eventTabs').append(b);}}
    function debug(){if(!dialog.open)return;const d=api.runtime();$('eventDebugger').textContent=JSON.stringify(d,null,2);}
    function open(){if(!selected()?.pages)return;refresh();inspector.hidden=false;tabs();if(!dialog.open)dialog.showModal();debug();clearInterval(timer);timer=setInterval(debug,250);}
    function close(){dialog.close();clearInterval(timer);timer=null;}
    $('openEventEditor').onclick=open;$('closeEventWindow').onclick=close;dialog.addEventListener('close',()=>{clearInterval(timer);timer=null;});
    new MutationObserver(tabs).observe($('eventPage'),{childList:true});
    $('commandList').addEventListener('click',event=>{const li=event.target.closest('li');if(!li)return;commandSelection=[...$('commandList').children].indexOf(li);for(const row of $('commandList').children)row.classList.toggle('commandSelected',row===li);});
    $('clipboardPage').onclick=()=>{pageClipboard=structuredClone(selected()?.pages[page()]);};
    $('pastePage').onclick=()=>{const e=selected();if(!pageClipboard||!e?.pages||e.pages.length>=12)return;api.mutate(()=>e.pages.splice(page()+1,0,structuredClone(pageClipboard)),()=>{setPage(page()+1);tabs();});};
    $('copyCommand').onclick=()=>{const c=selected()?.pages[page()]?.commands[commandSelection];if(c)commandClipboard=structuredClone(c);};
    $('pasteCommand').onclick=()=>{const p=selected()?.pages[page()];if(!commandClipboard||!p)return;api.mutate(()=>p.commands.splice(commandSelection<0?p.commands.length:commandSelection,0,structuredClone(commandClipboard)),refresh);};
    $('testEvent').onclick=()=>{const id=selected().id;close();returnButton.hidden=false;api.testEvent(id);};
    returnButton.onclick=()=>{returnButton.hidden=true;const last=api.runtime();api.returnEditor();open();$('eventDebugger').textContent='Last playtest:\n'+JSON.stringify(last,null,2);};
    // Templates contain authored data only, never playtest switches or damage.
    let templates=[];try{templates=JSON.parse(localStorage.getItem('frontier-event-templates')||'[]');if(!Array.isArray(templates))templates=[];}catch{}
    function templateList(){$('eventTemplates').replaceChildren(new Option('Choose template',''),...templates.map((e,i)=>new Option(e.name,String(i))));}
    $('saveEventTemplate').onclick=()=>{const e=selected();if(!e?.pages||templates.length>=50)return;templates.push(structuredClone(e));localStorage.setItem('frontier-event-templates',JSON.stringify(templates));templateList();};
    $('placeEventTemplate').onclick=()=>{if($('eventTemplates').value==='')return;const e=structuredClone(templates[Number($('eventTemplates').value)]);if(!e)return;e.id='template-'+Date.now();e.x=Math.max(1,Math.min(47,e.x+1));api.mutate(()=>api.world().events.push(e),()=>{choose(e.id);open();});};
    templateList();return {open,selectedIndex:()=>commandSelection};
  }
  root.FrontierWorkbench={create};
})(window);
