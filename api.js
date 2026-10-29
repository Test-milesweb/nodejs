export async function handleApi(request, runtime = 'Cloudflare Workers') {
  const path = new URL(request.url).pathname;
  const headers = {'Content-Type':'application/json', 'Cache-Control':'no-store'};
  const reply = (data, status=200) => new Response(JSON.stringify(data), {status, headers});
  if (path === '/api/health') {
    if(request.method !== 'GET') return reply({error:'Method not allowed'},405);
    return reply({status:'ok', application:'Node.js Test Lab', runtime, timestamp:new Date().toISOString()});
  }
  if(path === '/api/echo') {
    if(request.method !== 'POST') return reply({error:'Use POST with a JSON body'},405);
    if(!request.headers.get('content-type')?.includes('application/json')) return reply({error:'Content-Type must be application/json'},415);
    const text=await request.text();
    if(new TextEncoder().encode(text).length>16384) return reply({error:'Body exceeds 16 KB'},413);
    try { return reply({success:true, received:JSON.parse(text), timestamp:new Date().toISOString()}); }
    catch { return reply({error:'Invalid JSON body'},400); }
  }
  return reply({error:'Not found'},404);
}
