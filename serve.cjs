// Optional localhost-only asset server. Resolve decoded paths inside this folder, reject traversal, and never expose it on all network interfaces.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,types={
  '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'
}
;
http.createServer(/* @function serve.callback.1 — Provides the callback for http create server. Inputs: req; res. Uses: path resolve; decode uricomponent; req url split; p starts with. Returns: without a result. */ (req,res)=>{
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
      res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');
      res.end(data);
    }
    );
  }
  catch{
    res.writeHead(400);
    res.end('Bad request');
  }
}
).listen(8765,'127.0.0.1',/* @function serve.callback.3 — Returns console log using "Sprite Frontier: http://127.0.0.1:8765". Inputs: no explicit arguments; uses enclosing module state. Returns: console log using "Sprite Frontier: http://127.0.0.1:8765". */ ()=>console.log('Sprite Frontier: http://127.0.0.1:8765'));
