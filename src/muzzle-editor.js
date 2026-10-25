/* MAINTAINER GUIDE
 * Standalone calibration UI embedded by the main game. Edits a local data copy until Apply posts it to the parent. Export preserves a project JSON copy; localStorage is convenience storage rather than a portable project format.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(){
  const $=id=>document.getElementById(id),canvas=$('preview'),ctx=canvas.getContext('2d');
  let data=structuredClone(FrontierMuzzleData),image=FrontierCandy.image,pending;
  const profile=()=>data.profiles.find(p=>p.id===$('profile').value),indices=()=>[Number($('row').value),Number($('column').value)];
// Create missing frame calibration with center defaults; subsequent edits affect only the selected frame.
  function selectedPoint(){
    const p=profile(),[row,col]=indices();
    return p.muzzles[row+':'+col]??={
      x:col*p.frameWidth+p.frameWidth/2,y:row*p.frameHeight+p.frameHeight/2,flashX:col*p.frameWidth+p.frameWidth/2,flashY:row*p.frameHeight+p.frameHeight/2,yawOffset:0,pitchOffset:0
    }
    ;
  }
// Populate direction/frame controls and choose the correct sheet image for the selected profile.
  function controls(){
    const p=profile();
    $('row').replaceChildren(...Array.from({
      length:p.rows
    }
    ,(_,i)=>new Option('Row '+(i+1),i)));
    $('column').replaceChildren(...Array.from({
      length:p.columns
    }
    ,(_,i)=>new Option('Frame '+(i+1),i)));
    $('rows').value=p.rows;
    $('columns').value=p.columns;
    $('referenceHeight').value=p.referenceHeight;
    image=p.id==='candy-armed'?FrontierCandy.image:new Image();
    if(p.id!=='candy-armed')image.src=p.sheetData||p.sheet;
    image.onload=draw;
    read();
  }
// Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range.
  function refresh(){
    const id=$('profile').value;
    $('profile').replaceChildren(...data.profiles.map(p=>new Option(p.id,p.id)));
    if(data.profiles.some(p=>p.id===id))$('profile').value=id;
    controls();
  }
// Populate numeric angle controls from the selected muzzle and redraw its markers.
  function read(){
    const m=selectedPoint();
    $('yaw').value=m.yawOffset||0;
    $('pitch').value=m.pitchOffset||0;
    draw();
  }
  function draw(){
    const p=profile(),[row,col]=indices(),m=selectedPoint();
    canvas.width=p.frameWidth;
    canvas.height=p.frameHeight;
    ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(image.complete&&image.naturalWidth)ctx.drawImage(image,col*p.frameWidth,row*p.frameHeight,p.frameWidth,p.frameHeight,0,0,p.frameWidth,p.frameHeight);
    for(const [x,y,color] of [[m.x,m.y,'#00eaff'],[m.flashX,m.flashY,'#ff9c44']]){
      ctx.strokeStyle=color;
      ctx.beginPath();
      ctx.arc(x-col*p.frameWidth,y-row*p.frameHeight,6,0,Math.PI*2);
      ctx.stroke();
    }
    const x=m.x-col*p.frameWidth,y=m.y-row*p.frameHeight,angle=(m.yawOffset||0)*Math.PI/180;
    ctx.strokeStyle='#ff5577';
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+Math.cos(angle)*50,y+Math.sin(angle)*50);
    ctx.stroke();
    $('result').textContent='Origin '+Math.round(m.x)+', '+Math.round(m.y)+' · Flash '+Math.round(m.flashX)+', '+Math.round(m.flashY);
  }
  canvas.onclick=e=>{
    const p=profile(),[row,col]=indices(),rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)*canvas.width/rect.width+col*p.frameWidth,y=(e.clientY-rect.top)*canvas.height/rect.height+row*p.frameHeight,m=selectedPoint();
    if($('point').value==='muzzle'){
      m.x=x;
      m.y=y;
    }
    else{
      m.flashX=x;
      m.flashY=y;
    }
    draw();
  }
  ;
  $('yaw').oninput=$('pitch').oninput=()=>{
    const m=selectedPoint();
    m.yawOffset=Number($('yaw').value);
    m.pitchOffset=Number($('pitch').value);
    draw();
  }
  ;
  $('referenceHeight').oninput=()=>profile().referenceHeight=Math.max(1,Number($('referenceHeight').value));
  $('row').onchange=$('column').onchange=read;
  $('profile').onchange=controls;
  $('copyRow').onclick=()=>{
    const p=profile(),[row,col]=indices(),m=structuredClone(selectedPoint());
    for(let i=0;
    i<p.columns;
    i++)p.muzzles[row+':'+i]={
      ...m,x:m.x+(i-col)*p.frameWidth,flashX:m.flashX+(i-col)*p.frameWidth
    }
    ;
    draw();
  }
  ;
  $('sheet').onchange=async()=>{
    const file=$('sheet').files[0];
    if(!file)return;
    pending=await new Promise(resolve=>{
      const r=new FileReader();
      r.onload=()=>resolve(r.result);
      r.readAsDataURL(file);
    }
    );
  }
  ;
  $('newProfile').onclick=async()=>{
    if(!pending)return;
    const img=new Image();
    img.src=pending;
    await img.decode();
    const rows=Math.max(1,Math.min(16,Number($('rows').value))),columns=Math.max(1,Math.min(12,Number($('columns').value))),w=img.width/columns,h=img.height/rows;
    if(!Number.isInteger(w)||!Number.isInteger(h)){
      alert('Sheet dimensions must divide evenly.');
      return;
    }
    const id='sprite-'+Date.now(),frames=[];
    for(let row=0;
    row<rows;
    row++)for(let col=0;
    col<columns;
    col++)frames.push({
      x:col*w,y:row*h,w,h,anchorX:w/2
    }
    );
    data.profiles.push({
      id,sheetData:pending,sheet:'img/characters/custom.png',rows,columns,frameWidth:w,frameHeight:h,referenceHeight:h,frames,direction:{
        rows:Array.from({
          length:rows
        }
        ,(_,i)=>i),walkSequence:columns>=3?[1,2,1,0]:[0],frameSeconds:.14,idleColumn:Math.min(1,columns-1)
      }
      ,muzzles:{
      }
    }
    );
    refresh();
    $('profile').value=id;
    controls();
  }
  ;
  $('apply').onclick=()=>{
    try{
      FrontierMuzzle.validate(data);
      window.parent.postMessage({
        type:'phanicom-muzzles',data
      }
      ,'*');
      $('result').textContent='Applied. Export JSON to keep a project copy.';
    }
    catch(e){
      $('result').textContent=e.message;
    }
  }
  ;
  $('export').onclick=()=>{
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{
      type:'application/json'
    }
    ));
    a.download='muzzles.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  ;
  $('import').onchange=async()=>{
    try{
      data=FrontierMuzzle.validate(JSON.parse(await $('import').files[0].text()));
      refresh();
    }
    catch(e){
      $('result').textContent=e.message;
    }
  }
  ;
  window.addEventListener('message',event=>{
    if(event.source===parent&&event.data?.type==='phanicom-muzzle-open'){
      data=FrontierMuzzle.validate(event.data.data);
      refresh();
    }
  }
  );
  refresh();
}
)();
