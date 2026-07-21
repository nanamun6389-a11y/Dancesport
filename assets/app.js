
const DBKEY='danceflow_db_v1';
const demo=(window.DANCEFLOW_SEED||{competitions:[]});
function load(){try{const saved=JSON.parse(localStorage.getItem(DBKEY));if(saved&&saved.competitions&&saved.competitions.length)return saved;const fresh=structuredClone(demo);localStorage.setItem(DBKEY,JSON.stringify(fresh));return fresh}catch(e){return structuredClone(demo)}}
let db=load(), currentId=db.competitions[0]?.id;
function save(){localStorage.setItem(DBKEY,JSON.stringify(db))}
function comp(){return db.competitions.find(x=>x.id===currentId)}
function uid(p='x'){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function initSelect(){
 const s=document.querySelector('#competitionSelect'); s.innerHTML='';
 db.competitions.forEach(c=>{let o=document.createElement('option');o.value=c.id;o.textContent=c.short||c.name;s.appendChild(o)});
 s.value=currentId;s.onchange=()=>{currentId=s.value;renderAll()}
}
function renderDashboard(){
 const c=comp(); if(!c)return;
 dashName.textContent=c.name;dashMeta.textContent=[c.date,c.venue,c.city].filter(Boolean).join(' · ');
 statEntries.textContent=c.entries.length;statJudges.textContent=c.judges.filter(j=>j.active).length;statEvents.textContent=c.timetable.filter(t=>t.no).length;statStart.textContent=c.start||'-';
}
function fillComp(){
 const c=comp();[['compName','name'],['compShort','short'],['compDate','date'],['compStart','start'],['compVenue','venue'],['compCity','city'],['compOrganizer','organizer'],['compContact','contact']].forEach(([id,k])=>document.getElementById(id).value=c[k]||'');
 logoPreview.src=c.logo||'';logoPreview.style.display=c.logo?'block':'none';baseStart.value=c.start||'11:30';
}
function renderEntries(){
 const q=(entryFilter.value||'').toLowerCase(), c=comp();
 entryBody.innerHTML=c.entries.filter(e=>Object.values(e).join(' ').toLowerCase().includes(q)).map(e=>`<tr><td>${esc(e.back)}</td><td>${esc(e.player)}</td><td>${esc(e.age)}</td><td>${esc(e.style)}</td><td>${esc(e.event)}</td><td>${esc(e.country)}</td><td class=row-actions><button class="small ghost" onclick="editEntry('${e.id}')">Edit</button> <button class="small danger" onclick="delEntry('${e.id}')">Delete</button></td></tr>`).join('');
}
function renderJudges(){
 judgeBody.innerHTML=comp().judges.map(j=>`<tr><td>${esc(j.name)}</td><td>${esc(j.country)}</td><td>${esc(j.type)}</td><td>${esc(j.code)}</td><td>${j.active?'Yes':'No'}</td><td><button class="small ghost" onclick="editJudge('${j.id}')">Edit</button> <button class="small danger" onclick="delJudge('${j.id}')">Delete</button></td></tr>`).join('');
}
function renderTime(){
 timeBody.innerHTML=comp().timetable.map((t,i)=>`<tr><td>${esc(t.time)}</td><td>${esc(t.no)}</td><td>${esc(t.round)}</td><td>${esc(t.name)}</td><td>${esc(t.dance)}</td><td>${esc(t.duration)}</td><td>${esc(t.entries)}</td><td><button class="small ghost" onclick="moveTime(${i},-1)">↑</button> <button class="small ghost" onclick="moveTime(${i},1)">↓</button></td><td><button class="small ghost" onclick="editTime('${t.id}')">Edit</button> <button class="small danger" onclick="delTime('${t.id}')">Delete</button></td></tr>`).join('');
}
function renderAll(){initSelect();renderDashboard();fillComp();renderEntries();renderJudges();renderTime();renderPoster()}
document.querySelectorAll('.nav[data-page]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.querySelector('#page-'+b.dataset.page).classList.add('active')})
newCompetitionBtn.onclick=()=>{const name=prompt('Competition name');if(!name)return;const id=uid('c');db.competitions.push({id,name,short:name,date:'',start:'11:30',venue:'',city:'',organizer:'',contact:'',logo:'',entries:[],judges:[],timetable:[]});currentId=id;save();renderAll()}
saveCompetition.onclick=()=>{const c=comp();Object.assign(c,{name:compName.value,short:compShort.value,date:compDate.value,start:compStart.value,venue:compVenue.value,city:compCity.value,organizer:compOrganizer.value,contact:compContact.value});save();renderAll();alert('Saved')}
compLogo.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{comp().logo=r.result;save();fillComp();renderPoster()};r.readAsDataURL(f)}
entryFilter.oninput=renderEntries;
function openEditor(title,fields,onSave){editorTitle.textContent=title;editorFields.innerHTML=fields.map(f=>`<label>${f.label}${f.type==='select'?`<select id="ed_${f.key}">${f.options.map(o=>`<option ${o==f.value?'selected':''}>${o}</option>`).join('')}</select>`:`<input id="ed_${f.key}" value="${esc(f.value??'')}">`}</label>`).join('');editorDialog.showModal();editorSave.onclick=e=>{e.preventDefault();let v={};fields.forEach(f=>v[f.key]=document.getElementById('ed_'+f.key).value);onSave(v);editorDialog.close();save();renderAll()}}
addEntry.onclick=()=>editEntry();window.editEntry=id=>{let e=comp().entries.find(x=>x.id===id)||{id:uid('e'),back:'',player:'',age:'',style:'Latin',event:'',country:''};openEditor(id?'Edit Entry':'Add Entry',[{key:'back',label:'Back Number',value:e.back},{key:'player',label:'Player / Couple',value:e.player},{key:'age',label:'Age / Category',value:e.age},{key:'style',label:'Style',type:'select',options:['Latin','Modern','Other'],value:e.style},{key:'event',label:'Event',value:e.event},{key:'country',label:'Country',value:e.country}],v=>{Object.assign(e,v);if(!id)comp().entries.push(e)})}
window.delEntry=id=>{if(confirm('Delete entry?')){comp().entries=comp().entries.filter(x=>x.id!==id);save();renderAll()}}
addJudge.onclick=()=>editJudge();window.editJudge=id=>{let j=comp().judges.find(x=>x.id===id)||{id:uid('j'),name:'',country:'',type:'International',code:'',active:true};openEditor(id?'Edit Judge':'Add Judge',[{key:'name',label:'Name',value:j.name},{key:'country',label:'Country',value:j.country},{key:'type',label:'Type',type:'select',options:['International','National','Chairman'],value:j.type},{key:'code',label:'Judge Code',value:j.code},{key:'active',label:'Active (true/false)',value:String(j.active)}],v=>{v.active=v.active==='true';Object.assign(j,v);if(!id)comp().judges.push(j)})}
window.delJudge=id=>{if(confirm('Delete judge?')){comp().judges=comp().judges.filter(x=>x.id!==id);save();renderAll()}}
addEvent.onclick=()=>editTime();window.editTime=id=>{let t=comp().timetable.find(x=>x.id===id)||{id:uid('t'),time:'',no:'',round:'Final',name:'',dance:'',duration:'1:15',entries:''};openEditor(id?'Edit Event':'Add Event',[{key:'time',label:'Start Time',value:t.time},{key:'no',label:'EVENT Number',value:t.no},{key:'round',label:'Round',type:'select',options:['Quarter Final','Semi Final','Final','Grand Final','Break','Opening Ceremony','Awards'],value:t.round},{key:'name',label:'Event Name',value:t.name},{key:'dance',label:'Dance',value:t.dance},{key:'duration',label:'Duration mm:ss',value:t.duration},{key:'entries',label:'Entries',value:t.entries}],v=>{Object.assign(t,v);if(!id)comp().timetable.push(t)})}
window.delTime=id=>{if(confirm('Delete event?')){comp().timetable=comp().timetable.filter(x=>x.id!==id);save();renderAll()}}
window.moveTime=(i,d)=>{let a=comp().timetable,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];save();renderAll()}
renumberEvents.onclick=()=>{let n=1;comp().timetable.forEach(t=>{if(['Break','Opening Ceremony','Awards'].includes(t.round))t.no='';else t.no=String(n++)});save();renderAll()}
function toSec(hm){let[a,b]=hm.split(':').map(Number);return a*3600+b*60}function fmtSec(s){s=((s%86400)+86400)%86400;let h=Math.floor(s/3600),m=Math.floor((s%3600)/60),x=s%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}${x?':'+String(x).padStart(2,'0'):''}`}
function durSec(x){let p=x.split(':').map(Number);return p.length===2?p[0]*60+p[1]:0}
recalculateTimes.onclick=()=>{let s=toSec(baseStart.value);comp().start=baseStart.value;comp().timetable.forEach(t=>{t.time=fmtSec(s);s+=durSec(t.duration)});save();renderAll()}
function csvCell(v){return `"${String(v??'').replaceAll('"','""')}"`}
exportEntries.onclick=()=>{let rows=[['Back No','Player','Age','Style','Event','Country'],...comp().entries.map(e=>[e.back,e.player,e.age,e.style,e.event,e.country])];let blob=new Blob([rows.map(r=>r.map(csvCell).join(',')).join('\n')],{type:'text/csv'});downloadBlob(blob,(comp().short||'competition')+'_entries.csv')}
entryCsv.onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{let lines=r.result.split(/\r?\n/).filter(Boolean), head=lines.shift();lines.forEach(line=>{let a=line.split(',').map(x=>x.replace(/^"|"$/g,'').replaceAll('""','"'));comp().entries.push({id:uid('e'),back:a[0]||'',player:a[1]||'',age:a[2]||'',style:a[3]||'',event:a[4]||'',country:a[5]||''})});save();renderAll()};r.readAsText(f)}
downloadBackup.onclick=()=>downloadBlob(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),'danceflow_backup.json')
restoreBackup.onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{db=JSON.parse(r.result);currentId=db.competitions[0].id;save();renderAll();alert('Restored')}catch(err){alert('Invalid backup')}};r.readAsText(f)}
resetDemo.onclick=()=>{if(confirm('Reset all local data?')){db=structuredClone(demo);currentId=db.competitions[0].id;save();renderAll()}}
function downloadBlob(blob,name){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
generatePrompt.onclick=()=>{let c=comp();promoPrompt.value=`Premium international dancesport championship campaign image for ${c.name}, ${c.city||''}. Elegant ballroom floor, dynamic Latin and Standard dance silhouettes, editorial luxury lighting, sophisticated event branding, high-end sports poster, ${promoStyle.value} palette, no text, no logos, vertical composition.`}
function renderPoster(){
 const c=comp(),can=posterCanvas,ctx=can.getContext('2d'),style=promoStyle?.value||'navy';
 let bg=style==='black'?'#0b0b0c':style==='white'?'#f7f7f5':'#071a33',fg=style==='white'?'#111827':'#f6f7f9',accent=style==='black'?'#c7a34b':style==='white'?'#9ca3af':'#aab6c6';
 ctx.fillStyle=bg;ctx.fillRect(0,0,can.width,can.height);
 ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(60,60,960,1230);
 ctx.fillStyle=accent;ctx.font='600 28px Arial';ctx.fillText('INTERNATIONAL DANCESPORT',90,130);
 ctx.fillStyle=fg;ctx.font='700 72px Arial';wrap(ctx,c.name||'COMPETITION',90,260,900,82);
 ctx.fillStyle=accent;ctx.font='600 34px Arial';ctx.fillText(promoHeadline?.value||'ENTRY NOW OPEN',90,820);
 ctx.fillStyle=fg;ctx.font='400 40px Arial';ctx.fillText(promoSub?.value||'',90,880);
 ctx.fillStyle=accent;ctx.font='500 30px Arial';ctx.fillText([c.date,c.venue,c.city].filter(Boolean).join(' · '),90,1180);
 ctx.fillStyle=fg;ctx.font='700 26px Arial';ctx.fillText(c.short||'',90,1240);
}
function wrap(ctx,text,x,y,max,wlh){let words=text.split(' '),line='';for(let n=0;n<words.length;n++){let test=line+words[n]+' ';if(ctx.measureText(test).width>max&&n>0){ctx.fillText(line,x,y);line=words[n]+' ';y+=wlh}else line=test}ctx.fillText(line,x,y)}
renderPoster.onclick=renderPoster;promoHeadline.oninput=renderPoster;promoSub.oninput=renderPoster;promoStyle.onchange=renderPoster;
downloadPoster.onclick=()=>{renderPoster();let a=document.createElement('a');a.download=(comp().short||'competition')+'_poster.png';a.href=posterCanvas.toDataURL('image/png');a.click()}
renderAll();
