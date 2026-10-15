// Optional localhost-only asset server. Resolve decoded paths inside this folder, reject traversal, and never expose it on all network interfaces.
// October 15, 2026 (0.15.27): this is now the normal way to run the game locally
// (`npm start`), because assets are separate PNG/GLB files rather than embedded
// copies. Adds correct content types for images, models, audio and fonts, and
// exports start() so browser tests can serve the game on a free port.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,types={
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml',
  '.glb':'model/gltf-binary','.gltf':'model/gltf+json','.bin':'application/octet-stream',
  '.ogg':'audio/ogg','.wav':'audio/wav','.mp3':'audio/mpeg',
  '.ttf':'font/ttf','.otf':'font/otf','.woff':'font/woff','.woff2':'font/woff2',
  '.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8','.md':'text/markdown; charset=utf-8'
}
;
/* @function serve.handler — Inputs: Node request and response. Returns nothing; serves one file from this folder (index.html for "/"), 403 for paths escaping the folder, 404 for missing files and 400 for malformed URLs. Retains the original traversal guard. */
function handler(req,res){
  try{
    const p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
    if(!p.startsWith(root+path.sep)){
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(p,/* @function serve.callback.2 — Provides the callback for fs read file. Inputs: e; data. Uses: res write head; res end; res set header; path extname. Returns: without a result. */ (e,data)=>{
      if(e){
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.setHeader('Content-Type',types[path.extname(p).toLowerCase()]||'application/octet-stream');
      res.end(data);
    }
    );
  }
  catch{
    res.writeHead(400);
    res.end('Bad request');
  }
}
/* @function serve.start — Inputs: port (0 picks a free one) and optional host, default 127.0.0.1. Returns a promise for { server, url } once listening; rejects if the port is taken. Never listens on all interfaces. */
function start(port=8765,host='127.0.0.1'){
  return new Promise(/* @function serve.listen — Inputs: promise resolve/reject. Returns nothing; starts the server and settles when it is listening or fails. */ (resolve,reject)=>{
    const server=http.createServer(handler);
    server.once('error',reject);
    server.listen(port,host,/* @function serve.listening — Inputs: none. Resolves with the server and its base URL. */ ()=>resolve({server,url:'http://'+host+':'+server.address().port+'/'}));
  });
}
module.exports={start,types};
if(require.main===module)start().then(/* @function serve.callback.3 — Inputs: started server record. Prints the local address to open. */ ({url})=>console.log('Sprite Frontier: '+url),/* @function serve.failed — Inputs: listen error. Prints a readable reason and exits with failure. */ (error)=>{console.error('Could not start the local server: '+error.message);process.exitCode=1;});
