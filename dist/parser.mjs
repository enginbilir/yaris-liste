export const upper = value => String(value ?? '').trim().toLocaleUpperCase('tr-TR');
export const normal = value => upper(value).replaceAll('İ','I').replaceAll('Ü','U').replaceAll('Ö','O').replaceAll('Ş','S').replaceAll('Ç','C').replaceAll('Ğ','G').replace(/\s+/g,' ').trim();
export const keys=['binici','kulup','atinAdi','yukseklik'];
export function linesFromItems(items){
 const lines=[];
 for(const item of items){if(!item.str?.trim())continue;const x=item.transform[4],y=item.transform[5];let l=lines.find(l=>Math.abs(l.y-y)<3);if(!l){l={y,items:[]};lines.push(l)}l.items.push({text:item.str,x,width:item.width||0});}
 return lines.sort((a,b)=>b.y-a.y).map(l=>({...l,items:l.items.sort((a,b)=>a.x-b.x)}));
}
function field(text) {
 const n=normal(text);
 if (/^(BINICI|SPORCU|RIDER)( ADI( SOYADI)?)?$/.test(n)) return 'binici';
 if (/^(KULUP|KULUBU|CLUB)$/.test(n)) return 'kulup';
 if (/^(ATIN ADI|AT ADI|HORSE( NAME)?|AT)$/.test(n)) return 'atinAdi';
 if (/^(YUKSEKLIK|HEIGHT)$/.test(n)) return 'yukseklik';
 if (/^(S[. ]?NO[.]?|SIRA( NO)?|SIRA NO[.])$/.test(n)) return '_order';
 return null;
}
function tableColumns(line,page) {
 const labels=line.items.map(item=>({...item,key:field(item.text)}));
 if (!labels.some(i=>i.key==='binici') || !labels.some(i=>i.key==='atinAdi')) return null;
 // Headings may be centered in much wider cells. Use drawn grid boundaries,
 // not the heading's left edge, to locate the actual contents of each column.
 const edges=[];
 for (const edge of (page.verticals || []).filter(v=>v.bottom<=line.y+1 && v.top>=line.y-1).sort((a,b)=>a.x-b.x)) {
   if (!edges.length || edge.x-edges.at(-1)>0.8) edges.push(edge.x);
 }
 const bounded=labels.map(label=>{
   const center=label.x+label.width/2;
   const left=edges.findLastIndex(x=>x<center);
   return {...label,left:edges[left],right:edges[left+1]};
 });
 const grid=bounded.every(l=>Number.isFinite(l.left)&&Number.isFinite(l.right)) && new Set(bounded.map(l=>l.left)).size===labels.length;
 return {grid, numbered:labels.some(l=>l.key==='_order'), columns: grid
   ? bounded.map(l=>({key:l.key,left:l.left/page.width,right:l.right/page.width}))
   : labels.map((l,i)=>({key:l.key,left:l.x/page.width-0.013,right:(labels[i+1]?.x ?? page.width)/page.width-0.013}))};
}
export function parsePages(pages) {
 let table=null,height='',rows=[],unmapped=[],gridPages=[],incomplete=[];
 for (const page of pages) {
   let onPage=0,pending=null,lastY=null;
   const finish=()=>{
     if (!pending) return;
     const row=Object.fromEntries(keys.map(k=>[k,upper(pending[k])]));
     row.yukseklik ||= height;
     if (pending._order) row._sourceNumber=pending._order;
     row._sourcePage=page.number;
     if (!row.binici || !row.atinAdi || !row.kulup) incomplete.push(rows.length+1);
     rows.push(row); onPage++; pending=null;
   };
   for (const line of page.lines) {
     const n=normal(line.items.map(i=>i.text).join(' '));
     const nextTable=tableColumns(line,page);
     if (nextTable) {finish(); table=nextTable; if(table.grid && !gridPages.includes(page.number)) gridPages.push(page.number); continue;}
     const h=n.match(/\b(\d{2,3})\s*CM\b/);
     if (/^YARISMA NO\b/.test(n)) {finish(); height=''; continue;}
     if (h && (/YUKSEKLIK|YARIS|KOSU|MUSABAKA|PARKUR/.test(n) || line.items.length===1)) {finish(); height=h[1]+' CM'; continue;}
     if (!table) continue;
     if (/^(SAYFA|PAGE|TOPLAM|HAKEM|BASHAKEM|TARIH|YARISMA YERI|KATILIM|BAREM|TASNIF)\b/.test(n) || /BINICILER$/.test(n)) {finish(); continue;}
     const row={binici:'',kulup:'',atinAdi:'',yukseklik:'',_order:''};
     for (const item of line.items) {
       // Assign using each text run's start, so long horse names crossing a
       // printed cell boundary stay intact instead of becoming rider text.
       const x=item.x/page.width;
       const col=table.columns.find(c=>x>=c.left-0.0008 && x<c.right-0.0008);
       if (col?.key) row[col.key]+=(row[col.key]?' ':'')+item.text;
     }
     if (table.numbered) {
       if (/^\d+$/.test(row._order.trim())) {finish(); pending=row; lastY=line.y;}
       else if (pending && lastY-line.y<14 && keys.some(k=>row[k].trim())) {
         for (const key of keys) if(row[key].trim()) pending[key]+=(pending[key]?' ':'')+row[key];
         lastY=line.y;
       }
       continue;
     }
     if ([row.binici,row.kulup,row.atinAdi].filter(v=>v.trim()).length<2) continue;
     finish(); pending=row; finish();
   }
   finish();
   if (!onPage) unmapped.push(page.number);
 }
 return {rows,unmapped,gridPages,incomplete};
}
export function csvCell(value){let s=upper(value);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return /[",\n\r]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;}
export function exportCsv(rows){return rows.map(r=>keys.map(k=>csvCell(r[k])).join(',')).join('\r\n');}
export function exportTxt(rows){return rows.map(r=>`${upper(r.binici)} - ${upper(r.atinAdi)} - ${upper(r.kulup)}`).join('\r\n');}
