/* Cached asset catalog and playlist authoring. Refresh lists only on authored
 * changes; catalog browsing never loads or decodes audio files. Existing hidden
 * text controls remain a serialization adapter, not the authoring interface. */
(function(root){'use strict';const $=id=>document.getElementById(id);let catalog={exploration:[],combat:[]};
  const entries=[['musicExploration','exploration','Global exploration'],['musicCombat','combat','Global combat'],['musicMap','exploration','Map exploration override']];
  for(const [id,category,label]of entries){const original=$(id);original.closest('label').hidden=true;const group=document.createElement('section');group.className='playlistPicker';group.innerHTML='<h4></h4><select class="available" aria-label="Available tracks"></select><button class="addTrack">Add track</button><select class="playlist" size="4" aria-label="Selected playlist"></select><button class="removeTrack">Remove selected track</button><p class="assetWarning"></p>';group.querySelector('h4').textContent=label;original.closest('label').after(group);
    const available=group.querySelector('.available'),playlist=group.querySelector('.playlist');
    group.querySelector('.addTrack').onclick=()=>{if(!available.value)return;const names=original.value.split('\n').filter(Boolean);if(!names.includes(available.value))names.push(available.value);original.value=names.join('\n');refresh();};
    group.querySelector('.removeTrack').onclick=()=>{original.value=original.value.split('\n').filter(n=>n&&n!==playlist.value).join('\n');refresh();};
    original.picker={group,category,available,playlist};
  }
  const button=document.createElement('button');button.id='refreshMusicCatalog';button.textContent='Refresh audio folders';$('applyMusic').before(button);const status=document.createElement('p');status.id='musicCatalogStatus';button.after(status);
  function refresh(){for(const [id]of entries){const input=$(id),p=input.picker,names=input.value.split('\n').filter(Boolean),known=catalog[p.category]||[];p.available.replaceChildren(new Option(known.length?'Choose track':'No tracks in folder',''),...known.map(n=>new Option(n,n)));p.playlist.replaceChildren(...names.map(n=>new Option(n,n)));const missing=names.filter(n=>!known.includes(n));p.group.querySelector('.assetWarning').textContent=missing.length?'Missing from catalog: '+missing.join(', '):names.length?'':'Playlist empty.';}}
  async function scan(){button.disabled=true;try{catalog=root.FrontierDesktop?await root.FrontierDesktop.musicCatalog():root.FrontierMusicCatalog||catalog;status.textContent=root.FrontierDesktop?'Audio folders refreshed.':'Browser uses the saved asset catalog; desktop refresh discovers new files.';refresh();}catch(e){status.textContent='Could not read audio catalog: '+e.message;}finally{button.disabled=false;}}
  button.onclick=scan;
  root.FrontierMusicPicker={refresh,scan,catalog:()=>structuredClone(catalog),useManifest(value){if(value)catalog=structuredClone(value);refresh();}};scan();
})(window);
