/* October 29, 2026: user-authorized Skill-O-Matic interaction prototype.
 * Original A/B/C artwork remains unchanged. TEST SCAN is a non-persistent
 * interaction test, not a canonical skill or a Fallout probability system. */
(/* @function skillOMatic.install — Inputs: browser namespace. Exposes a DOM/controller factory using the existing game coordinator's pause, cursor, reach and inspection services. No separate simulation or saved skill state is installed. */ function (root) {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const segments = [
    [4,2,20,2], [22,4,22,18], [22,22,22,36], [4,38,20,38],
    [2,22,2,36], [2,4,2,18], [4,20,11,20], [13,20,20,20],
    [4,5,10,17], [20,5,14,17], [10,23,4,35], [14,23,20,35],
    [12,4,12,17], [12,23,12,36]
  ];
  const alphabet = {
    A:[0,1,2,4,5,6,7], B:[0,1,2,3,7,12,13], C:[0,3,4,5],
    D:[0,1,2,3,12,13], E:[0,3,4,5,6,7], F:[0,4,5,6,7],
    G:[0,2,3,4,5,7], H:[1,2,4,5,6,7], I:[0,3,12,13],
    J:[1,2,3,4], K:[4,5,9,11], L:[3,4,5], M:[1,2,4,5,8,9],
    N:[1,2,4,5,8,11], O:[0,1,2,3,4,5], P:[0,1,4,5,6,7],
    Q:[0,1,2,3,4,5,11], R:[0,1,4,5,6,7,11], S:[0,2,3,5,6,7],
    T:[0,12,13], U:[1,2,3,4,5], V:[4,5,9,10], W:[1,2,4,5,10,11],
    X:[8,9,10,11], Y:[8,9,13], Z:[0,3,9,10],
    "0":[0,1,2,3,4,5], "1":[1,2], "2":[0,1,3,4,6,7],
    "3":[0,1,2,3,6,7], "4":[1,2,5,6,7], "5":[0,2,3,5,6,7],
    "6":[0,2,3,4,5,6,7], "7":[0,1,2], "8":[0,1,2,3,4,5,6,7],
    "9":[0,1,2,3,5,6,7], "-":[6,7], " ":[]
  };
  /* @function skillOMatic.lettering — Inputs: short uppercase display label. Returns original SVG fourteen-segment alphabetic LCD lettering, with an accessible parent-button name supplied separately. Each label is created once; no external font/license or per-frame glyph work is required. */
  function lettering(text) {
    const svg = document.createElementNS(NS,"svg");
    svg.setAttribute("viewBox",`0 0 ${text.length*26} 40`);
    svg.setAttribute("aria-hidden","true");
    for (let i=0;i<text.length;i++) for (const index of alphabet[text[i]]||[]) {
      const line=document.createElementNS(NS,"line"), p=segments[index];
      line.setAttribute("x1",p[0]+i*26); line.setAttribute("y1",p[1]);
      line.setAttribute("x2",p[2]+i*26); line.setAttribute("y2",p[3]);
      line.setAttribute("stroke","#ed6346"); line.setAttribute("stroke-width","2.7");
      line.setAttribute("stroke-linecap","square"); svg.append(line);
    }
    return svg;
  }
  /* @function skillOMatic.create — Inputs: coordinator API allowed/prepare/finish/scan/log. Returns open/reset/target/status methods. Original PNG layers and one enabled test skill are mounted once; seventeen artwork slots include disabled empty test rows for real scrollbar travel. No inventory, HP, authored map or skill progression is changed. */
  function create(api) {
    const panel=document.createElement("section");panel.id="skillOMaticPanel";panel.hidden=true;
    panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label","Skill-O-Matic prototype");
    panel.innerHTML='<div class="skillOMaticToolbar"><span>SKILL-O-MATIC · TEST</span><button type="button" id="skillOMaticClose" aria-label="Close Skill-O-Matic">Close</button></div><div class="skillOMaticCase"><div class="skillOMaticWindow" id="skillOMaticList" tabindex="0" aria-label="Skills"><div class="skillOMaticStrip"></div></div><img class="skillOMaticHousing" src="img/ui/skill-o-matic/Skill-o-matic-A.png" alt="Skill-O-Matic housing"><div id="skillOMaticSlider" role="scrollbar" tabindex="0" aria-label="Scroll skills" aria-controls="skillOMaticList" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><img src="img/ui/skill-o-matic/Skill-o-matic-C.png" alt=""></div></div><p class="skillOMaticHelp" role="status">TEST SCAN: select it, then click a nearby object. Other slots are empty test rows.</p>';
    const frame=document.getElementById("gameFrame");frame.append(panel);
    const list=panel.querySelector(".skillOMaticWindow"), strip=panel.querySelector(".skillOMaticStrip"), thumb=panel.querySelector("#skillOMaticSlider"), help=panel.querySelector(".skillOMaticHelp");
    const button=document.createElement("button");button.id="remoteSkills";button.type="button";button.title="Skill-O-Matic test [K] — press P to use remote";button.setAttribute("aria-label","Open Skill-O-Matic");document.querySelector(".remoteDevice").append(button);
    const targetStatus=document.createElement("div");targetStatus.id="skillOMaticTarget";targetStatus.hidden=true;targetStatus.setAttribute("role","status");targetStatus.textContent="TEST SCAN — click a nearby target · Esc cancels";frame.append(targetStatus);
    let armed=false, drag=null, prior=null;
    for(let i=0;i<17;i++) {
      const row=document.createElement("button");row.type="button";row.className="skillOMaticRow";row.style.top=((31+i*83.5)/1502*100)+"%";row.style.height=(78/1502*100)+"%";
      row.disabled=i!==0;row.setAttribute("aria-label",i===0?"TEST SCAN — placeholder skill":"Empty skill slot "+(i+1));
      if(i===0) {row.id="skillOMaticTestScan";row.append(lettering("TEST SCAN"));row.onclick=/* @function skillOMatic.arm — Inputs: test-row click ignored. Closes the chooser, resumes cursor-targeting through its original coordinator, and arms only the harmless scan. No shot or event interaction is dispatched by this click. */ function(){panel.hidden=true;armed=true;targetStatus.hidden=false;api.finish(prior,true);};}
      strip.append(row);
    }
    /* @function skillOMatic.sync — Inputs: list scroll notification ignored. Maps actual clamped scroll progress into original-artwork thumb travel and accessible percentage. Uses CSS-scaled geometry, no animation loop or source mutation. */
    function sync(){const range=Math.max(0,list.scrollHeight-list.clientHeight),value=range?list.scrollTop/range:0;thumb.style.top=((118+value*480)/1058*100)+"%";thumb.setAttribute("aria-valuenow",String(Math.round(value*100)));}
    /* @function skillOMatic.scrollTo — Inputs: normalized scroll progress. Updates only the existing list's scrollTop, then thumb, clamping both ends. No world state changes. */
    function scrollTo(value){list.scrollTop=Math.max(0,Math.min(1,value))*Math.max(0,list.scrollHeight-list.clientHeight);sync();}
    /* @function skillOMatic.open — Inputs: optional button click ignored. Opens only eligible gameplay, retaining original cursor/pause ownership, clearing stale target selection and focusing the real test skill. No authored edits. */
    function open(){if(!api.allowed())return;armed=false;targetStatus.hidden=true;if(!panel.hidden)return;prior=api.prepare();panel.hidden=false;help.textContent="TEST SCAN: select it, then click a nearby object. Other slots are empty test rows.";sync();panel.querySelector("#skillOMaticTestScan").focus({preventScroll:true});}
    /* @function skillOMatic.close — Inputs: none. Cancels chooser/target selection and restores the original input owner through the coordinator. A failed target is never charged and no world interaction is executed. */
    function close(){const active=armed||!panel.hidden;reset();if(active)api.finish(prior,false);}
    /* @function skillOMatic.reset — Inputs: none. Discards transient selection/drag and hides UI on session replacement or edit-mode change without recapturing input or affecting the new session. */
    function reset(){armed=false;drag=null;panel.hidden=true;targetStatus.hidden=true;}
    button.onclick=open;panel.querySelector("#skillOMaticClose").onclick=close;
    list.addEventListener("scroll",sync);
    list.addEventListener("wheel",/* @function skillOMatic.wheel — Inputs: wheel delta in CSS pixels/lines/pages. Scrolls only this list, consumes page/camera zoom propagation and synchronizes original thumb. */function(event){event.preventDefault();event.stopPropagation();list.scrollTop+=event.deltaY*(event.deltaMode===1?18:event.deltaMode===2?list.clientHeight:1);sync();},{passive:false});
    thumb.onpointerdown=/* @function skillOMatic.thumbStart — Inputs: primary pointer in CSS pixels. Captures the supplied C thumb and its current progress; preserves grab offset instead of jumping on press. */function(event){if(event.button!==0)return;event.preventDefault();event.stopPropagation();const range=list.scrollHeight-list.clientHeight;drag={id:event.pointerId,y:event.clientY,value:range?list.scrollTop/range:0};thumb.setPointerCapture(event.pointerId);};
    thumb.onpointermove=/* @function skillOMatic.thumbMove — Inputs: captured pointer. Converts CSS-pixel drag to normalized 480/1058 artwork travel, then actual content scroll. Scaling/fullscreen do not change endpoint mapping. */function(event){if(!drag||event.pointerId!==drag.id)return;event.preventDefault();const height=panel.querySelector(".skillOMaticCase").getBoundingClientRect().height;scrollTo(drag.value+(event.clientY-drag.y)/(height*480/1058));};
    thumb.onpointerup=thumb.onpointercancel=/* @function skillOMatic.thumbEnd — Inputs: pointer release/cancel. Releases only transient drag state; browser owns capture release and source data is untouched. */function(){drag=null;};
    thumb.onkeydown=/* @function skillOMatic.thumbKeys — Inputs: scrollbar keyboard action. Supports arrows, Page Up/Down, Home/End through the same normalized scroll mapping and consumes handled keys only. */function(event){const value=Number(thumb.getAttribute("aria-valuenow"))/100,steps={ArrowDown:.06,ArrowUp:-.06,PageDown:.4,PageUp:-.4};if(Object.hasOwn(steps,event.key)||event.key==="Home"||event.key==="End"){event.preventDefault();event.stopPropagation();scrollTo(event.key==="Home"?0:event.key==="End"?1:value+steps[event.key]);}};
    document.addEventListener("keydown",/* @function skillOMatic.keys — Inputs: document keydown. K opens only allowed gameplay outside text fields. Escape cancels first; open chooser blocks gameplay shortcuts while preserving native keyboard button/scroll focus. F2 cancels without restoring old gameplay input and then reaches the editor owner. */function(event){if(event.key==="Escape"&&(armed||!panel.hidden||!targetStatus.hidden)){event.preventDefault();event.stopImmediatePropagation();close();return;}if(!panel.hidden){if(event.key==="F2"){reset();return;}if(event.target===thumb&&["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"].includes(event.key))return;event.stopImmediatePropagation();return;}if(event.key.toLowerCase()==="k"&&!event.repeat&&!event.ctrlKey&&!event.altKey&&!event.metaKey&&!/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)){event.preventDefault();event.stopImmediatePropagation();if(armed)close();else open();}},{capture:true});
    /* @function skillOMatic.target — Inputs: logical viewport point and mouse button. Returns true when the armed skill owns this press, preventing normal weapon/interaction routing. Left-click invokes original reach/inspection once; right-click cancels. Invalid targets retain selection and provide feedback, with no resource changes. */
    function target(point,mouseButton){if(!armed)return false;if(!api.allowed()){reset();return true;}if(mouseButton===2){close();return true;}if(mouseButton!==0)return true;const result=api.scan(point);if(result){armed=false;targetStatus.hidden=false;targetStatus.textContent="TEST SCAN applied to "+result+" · description shown on the CRT";}else{targetStatus.textContent="No reachable target — choose a nearby object · Esc cancels";api.log("TEST SCAN: no reachable target.");}return true;}
    return {open,reset,target,
      opened: /* @function skillOMatic.opened � Inputs: none. Returns chooser visibility for coordinator pause ownership, without exposing mutable state. */ function(){return !panel.hidden;},
      armed: /* @function skillOMatic.armed � Inputs: none. Returns transient target ownership for diagnostics and coordinator checks only. */ function(){return armed;}};
  }
  root.FrontierSkillOMatic={create,lettering};
})(window);
