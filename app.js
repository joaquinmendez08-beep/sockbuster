const K={p:'sb_prod',c:'sb_cart',o:'sb_ord',r:'sb_rev',t:'sb_tok'};
const $=s=>document.querySelector(s),clp=n=>'$'+Number(n).toLocaleString('es-CL');
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b64=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const USERS={cliente:{p:'1234',rol:'cliente'},admin:{p:'admin123',rol:'admin'}};
const seed=[
{id:1,nom:'Xenomorfo',cat:'Ciencia Ficción',obra:'Alien',precio:7990,stock:12,tallas:['S','M','L'],img:'👽'},
{id:2,nom:'Replicante',cat:'Ciencia Ficción',obra:'Blade Runner',precio:8490,stock:8,tallas:['M','L'],img:'🤖'},
{id:3,nom:'Payaso Nocturno',cat:'Terror 80s',obra:'It',precio:7490,stock:15,tallas:['S','M','L'],img:'🤡'},
{id:4,nom:'Máscara de Hockey',cat:'Terror 80s',obra:'Viernes 13',precio:7990,stock:6,tallas:['M','L'],img:'🏒'},
{id:5,nom:'Profesor de Química',cat:'Series de Drama',obra:'Breaking Bad',precio:8990,stock:10,tallas:['S','M','L'],img:'🧪'},
{id:6,nom:'Trono de Hierro',cat:'Series de Drama',obra:'Game of Thrones',precio:9490,stock:5,tallas:['M','L'],img:'⚔️'},
{id:7,nom:'Pez Payaso',cat:'Animación',obra:'Buscando a Nemo',precio:6990,stock:20,tallas:['S','M'],img:'🐠'},
{id:8,nom:'Vaquero de Juguete',cat:'Animación',obra:'Toy Story',precio:6990,stock:0,tallas:['S','M','L'],img:'🤠'}];
let prods=ld(K.p,seed),cart=ld(K.c,{}),revs=ld(K.r,{}),cat='Todas';
const msg=t=>$('#msg').textContent=t;
function session(){const t=localStorage.getItem(K.t);if(!t)return null;try{const p=JSON.parse(decodeURIComponent(escape(atob(t.split('.')[1]))));return p.exp>Date.now()/1000?p:null}catch(e){return null}}
function draw(){
const se=session(),adm=se&&se.rol=='admin',cats=['Todas',...new Set(prods.map(p=>p.cat))];
$('#auth').innerHTML=se?`Sesión: <b>${esc(se.sub)}</b> (${se.rol}) <button class="btn" data-a="out">Salir</button><details><summary>Ver token JWT</summary><code class="tok">${localStorage.getItem(K.t)}</code></details>`:`<input id="u" placeholder="Usuario" aria-label="Usuario"> <input id="pw" type="password" placeholder="Clave" aria-label="Clave"> <button class="btn" data-a="in">Ingresar</button> <span class="mut">Demo: cliente / 1234 · admin / admin123</span>`;
$('#cats').innerHTML=cats.map(c=>`<button class="chip ${c==cat?'on':''}" data-a="cat" data-v="${esc(c)}">${esc(c)}</button>`).join('');
$('#grid').innerHTML=prods.filter(p=>cat=='Todas'||p.cat==cat).map(p=>{
const rv=revs[p.id]||[],avg=rv.length?(rv.reduce((a,r)=>a+r.s,0)/rv.length).toFixed(1):'–';
return `<article class="card"><div class="ph" aria-hidden="true">${esc(p.img)}</div><h3>${esc(p.nom)}</h3><p class="mut">${esc(p.cat)} · ${esc(p.obra)}</p><p><b>${clp(p.precio)}</b> · Stock: ${p.stock}</p>
<select id="t${p.id}" aria-label="Talla">${p.tallas.map(t=>`<option>${esc(t)}</option>`).join('')}</select>
<button class="btn" data-a="add" data-v="${p.id}" ${p.stock<1?'disabled':''}>${p.stock<1?'Agotado':'Agregar al carrito'}</button>
<details><summary>Reseñas (${rv.length}) · ★ ${avg}</summary>${rv.map(r=>`<p class="rv">${'★'.repeat(r.s)}${'☆'.repeat(5-r.s)} <b>${esc(r.u)}</b>: ${esc(r.c)}</p>`).join('')}
${se?`<select id="s${p.id}" aria-label="Estrellas">${[5,4,3,2,1].map(n=>`<option value="${n}">${n} ★</option>`).join('')}</select> <input id="c${p.id}" placeholder="Tu comentario" maxlength="200" aria-label="Comentario"> <button class="btn" data-a="rev" data-v="${p.id}">Publicar reseña</button>`:'<p class="mut">Inicia sesión para opinar.</p>'}</details></article>`}).join('');
const rows=Object.entries(cart).map(([k,q])=>{const[id,t]=k.split('|'),p=prods.find(x=>x.id==id);return p?{k,p,t,q}:null}).filter(Boolean);
const tot=rows.reduce((a,r)=>a+r.p.precio*r.q,0);
$('#cart').innerHTML=rows.length?rows.map(r=>`<div class="row"><span>${esc(r.p.nom)} (${esc(r.t)})</span><span><button data-a="q" data-v="${esc(r.k)}" data-d="-1" aria-label="Quitar uno">−</button> ${r.q} <button data-a="q" data-v="${esc(r.k)}" data-d="1" aria-label="Agregar uno">+</button></span><span>${clp(r.p.precio*r.q)}</span></div>`).join('')+`<p><b>Total: ${clp(tot)}</b></p><button class="btn" data-a="pay">Pagar (simulado)</button>`:'<p class="mut">Tu carrito está vacío. Agrega un calcetín del catálogo.</p>';
$('#admin').hidden=!adm;
if(adm)$('#alist').innerHTML=prods.map(p=>`<div class="row"><span>${esc(p.nom)}</span><span>Precio <input id="pp${p.id}" type="number" min="0" value="${p.precio}" style="width:90px"> Stock <input id="ps${p.id}" type="number" min="0" value="${p.stock}" style="width:70px"> <button class="btn" data-a="save" data-v="${p.id}">Guardar</button></span></div>`).join('');
}
function pay(){
const need={};for(const[k,q]of Object.entries(cart)){const id=k.split('|')[0];need[id]=(need[id]||0)+q}
if(!Object.keys(need).length)return msg('El carrito está vacío.');
for(const id in need){const p=prods.find(x=>x.id==id);if(!p||p.stock<need[id]){msg('Stock insuficiente para '+(p?p.nom:'un producto')+'.');return draw()}}
const items=Object.entries(cart).map(([k,q])=>{const[id,t]=k.split('|'),p=prods.find(x=>x.id==id);return{nom:p.nom,t,q,sub:p.precio*q}});
for(const id in need)prods.find(x=>x.id==id).stock-=need[id];
const o={id:'SB-'+Date.now().toString(36).toUpperCase()+Math.floor(Math.random()*900+100),fecha:new Date().toLocaleString('es-CL'),items,total:items.reduce((a,i)=>a+i.sub,0)};
const os=ld(K.o,[]);os.push(o);sv(K.o,os);sv(K.p,prods);cart={};sv(K.c,cart);
$('#order').hidden=false;
$('#order').innerHTML=`<h3>Pedido confirmado</h3><p><b>${o.id}</b><br><span class="mut">${o.fecha}</span></p><ul>${items.map(i=>`<li>${esc(i.nom)} (${esc(i.t)}) × ${i.q} — ${clp(i.sub)}</li>`).join('')}</ul><p><b>Total: ${clp(o.total)}</b></p>`;
draw()}
document.addEventListener('click',e=>{
const b=e.target.closest('[data-a]');if(!b)return;
const a=b.dataset.a,v=b.dataset.v,se=session(),adm=se&&se.rol=='admin';msg('');
if(a=='cat')cat=v;
else if(a=='add'){const p=prods.find(x=>x.id==v),k=v+'|'+$('#t'+v).value,n=Object.entries(cart).filter(([x])=>x.split('|')[0]==v).reduce((s,[,q])=>s+q,0);if(n<p.stock)cart[k]=(cart[k]||0)+1;else msg('No hay más stock de '+p.nom+'.')}
else if(a=='q'){const id=v.split('|')[0],p=prods.find(x=>x.id==id),n=Object.entries(cart).filter(([x])=>x.split('|')[0]==id).reduce((s,[,q])=>s+q,0),d=+b.dataset.d;if(d>0&&n>=p.stock)msg('No hay más stock de '+p.nom+'.');else{cart[v]+=d;if(cart[v]<1)delete cart[v]}}
else if(a=='pay')return pay();
else if(a=='in'){const u=$('#u').value.trim(),x=USERS[u];if(!x||x.p!=$('#pw').value)msg('Usuario o clave incorrectos.');else{const n=Math.floor(Date.now()/1000);localStorage.setItem(K.t,[b64({alg:'HS256',typ:'JWT'}),b64({sub:u,rol:x.rol,iat:n,exp:n+3600}),'firma-simulada'].join('.'))}}
else if(a=='out')localStorage.removeItem(K.t);
else if(a=='rev'){const c=$('#c'+v).value.trim();if(!se||!c)msg('Escribe un comentario para publicar tu reseña.');else{(revs[v]=revs[v]||[]).push({u:se.sub,s:+$('#s'+v).value,c});sv(K.r,revs)}}
else if(a=='add2'){if(!adm)return msg('Solo el administrador puede registrar modelos.');const n=$('#an').value.trim();if(!n||!$('#ap').value)return msg('Indica al menos nombre y precio.');prods.push({id:Math.max(0,...prods.map(p=>p.id))+1,nom:n,cat:$('#ac').value.trim()||'Sin colección',obra:$('#ao').value.trim()||'—',precio:+$('#ap').value,stock:+$('#as').value||0,tallas:($('#at').value||'M').split(',').map(s=>s.trim()).filter(Boolean),img:$('#ai').value||'🧦'});sv(K.p,prods);['an','ac','ao','ap','as','at','ai'].forEach(i=>$('#'+i).value='')}
else if(a=='save'){if(!adm)return msg('Solo el administrador puede modificar el inventario.');const p=prods.find(x=>x.id==v);p.precio=+$('#pp'+v).value;p.stock=+$('#ps'+v).value;sv(K.p,prods);msg('Producto actualizado.')}
sv(K.c,cart);draw()});
draw();
