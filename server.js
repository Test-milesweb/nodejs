import http from 'node:http';
import { html } from './ui.js';
import { handleApi } from './api.js';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT || 3000);
const server = http.createServer(async (req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')) {
   const chunks=[];let size=0;
   for await(const chunk of req){size+=chunk.length;if(size>16384){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Body exceeds 16 KB'}));return;}chunks.push(chunk);}
   const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
   const result=await handleApi(request,'Node.js '+process.versions.node);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  if(url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:html);return;}
  if(url.pathname==='/nodejs-test-app.zip'){try{const zip=await readFile(new URL('./nodejs-test-app.zip',import.meta.url));res.writeHead(200,{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="nodejs-test-app.zip"'});res.end(zip);return;}catch{}}
  res.writeHead(404,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Not found'}));
 }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Internal server error'}));}
});
server.requestTimeout=15000;server.headersTimeout=10000;
server.listen(port,process.env.HOST || '0.0.0.0',()=>console.log('Node.js Test Lab listening on port '+port));
process.on('SIGTERM',()=>server.close());
