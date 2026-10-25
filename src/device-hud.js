/* MAINTAINER GUIDE
 * Modular device HUD with portrait states, equipment/status screens, skins, dragging and minimization. Positions are percentages inside gameFrame. Portrait frames are a separate HUD sheet, not the world sprite.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
  const face=document.getElementById('candyPortrait'),ctx=face.getContext('2d');
  const portrait=root.FrontierPortraitData,portraitImage=new Image();
  portraitImage.src=portrait.image;
  let lastHP=null,damageUntil=0,lastFrame='';
  const equipment=document.getElementById('equipmentScreen');
  for(const el of document.querySelectorAll('.portraitDevice,.deviceTV')){
    const backing=document.createElement('div');
    backing.className='screenBacking';
    el.prepend(backing);
  }
// Select health/damage/idle portrait frames and redraw only when the selected frame changes.
  function portraitUpdate(game){
    const hp=game.player.hp;
    if(lastHP!==null&&hp<lastHP)damageUntil=game.elapsed+portrait.damage.seconds;
    lastHP=hp;
    const band=portrait.healthBands.find(b=>hp>=b.min)||portrait.healthBands.at(-1);
    const idle=portrait.idle.frames[Math.floor(game.elapsed/portrait.idle.frameSeconds)%portrait.idle.frames.length];
    const key=game.elapsed<damageUntil?portrait.damage.frame:(band.state==='healthy'?idle:band.frame);
    face.dataset.state=game.elapsed<damageUntil?'damage':band.state;
    const f=portrait.frames[key]||portrait.frames.neutral;
    if(!portraitImage.complete||!portraitImage.naturalWidth||lastFrame===key)return;
    ctx.fillStyle=portrait.background;
    ctx.fillRect(0,0,200,200);
    ctx.imageSmoothingEnabled=false;
    const scale=Math.min(180/f.width,190/f.height),w=f.width*scale,h=f.height*scale;
    ctx.drawImage(portraitImage,f.x,f.y,f.width,f.height,(200-w)/2,(200-h)/2,w,h);
    lastFrame=key;
  }
  let weaponKey='',statusKey='';
  function update(game){
    const equipment=document.getElementById('equipmentScreen');
    const key=[game.player.weapon?.name,game.player.holstered,game.player.ammoLoaded,game.player.ammoReserve].join('|');
    if(key!==weaponKey){
      weaponKey=key;
      equipment.innerHTML='<svg viewBox="0 0 100 55" aria-label="9mm test weapon"><path d="M8 12H80L88 18V27H56L48 49H32L36 29H8Z M48 29H64V38H48" fill="#4a2019" stroke="#d46a3e" stroke-width="3"/></svg><span>'+(game.player.holstered?'HOLSTERED':game.player.weapon?.name||'UNARMED')+' · '+game.player.ammoLoaded+' / '+game.player.ammoReserve+'</span>';
    }
    if(statusKey!==game.player.hp){
      statusKey=game.player.hp;
      document.getElementById('statusScreen').textContent='VITALITY\n'+game.player.hp+' / 100';
    }
    portraitUpdate(game);
  }
// Swap device artwork while retaining the same functional modules and layout.
  function skin(name){
    for(const e of document.querySelectorAll('.floatingTV')){
      e.classList.toggle('navigatorSkin',name==='navigator');
      e.querySelector('img').src='img/pictures/'+(name==='navigator'?'Car Navigator 1.png':'Portrait TV C.png');
    }
  }
  const modules=[document.querySelector('.remoteDevice'),document.querySelector('.portraitDevice'),...document.querySelectorAll('.deviceTV')];
  for(const [i,el] of modules.entries()){
    if(i>=2){
      const right=document.querySelector('.rightDevices'),r=el.getBoundingClientRect();
      el.classList.add('floatingTV');
      el.style.right='3%';
      el.style.bottom=(3+(4-i)*25)+'%';
      el.style.width='21%';
      document.getElementById('deviceHud').append(el);
    }
    el.dataset.module=['Remote','Candy','Weapon','Info','Status'][i];
    const bar=document.createElement('div');
    bar.className='moduleHandle';
    bar.textContent=el.dataset.module;
    const min=document.createElement('button');
    min.textContent='−';
    min.title='Minimize / restore';
    min.onclick=()=>{
      el.classList.toggle('minimized');
      min.textContent=el.classList.contains('minimized')?'+':'−';
    }
    ;
    bar.append(min);
    el.append(bar);
    let drag=null;
    bar.onpointerdown=e=>{
      if(e.target===min||!document.getElementById('gameFrame').classList.contains('hudCursor'))return;
      e.preventDefault();
      const r=el.getBoundingClientRect(),f=document.getElementById('gameFrame').getBoundingClientRect();
      drag={
        dx:e.clientX-r.left,dy:e.clientY-r.top,f
      }
      ;
      bar.setPointerCapture(e.pointerId);
    }
    ;
    bar.onpointermove=e=>{
      if(!drag)return;
      const f=drag.f;
      el.style.left=Math.max(0,Math.min(f.width-el.offsetWidth,e.clientX-f.left-drag.dx))/f.width*100+'%';
      el.style.top=Math.max(0,Math.min(f.height-el.offsetHeight,e.clientY-f.top-drag.dy))/f.height*100+'%';
      el.style.right='auto';
      el.style.bottom='auto';
    }
    ;
    bar.onpointerup=bar.onpointercancel=()=>drag=null;
  }
  document.querySelector('.rightDevices').remove();
  root.FrontierDeviceHUD={
    update,skin
  }
  ;
}
)(window);
