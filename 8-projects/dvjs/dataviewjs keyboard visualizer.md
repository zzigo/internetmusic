

```dataviewjs
// DataviewJS: Keyboard visualizer for Obsidian (shows key, code, ASCII, and modifiers) on a canvas
// Notes:
// - Obsidian may intercept some shortcuts. Click the panel to focus it (or press Esc) to route keys here.
// - Shows live pressed keys, last events, and modifier status.

// ---------- layout ----------
const root = dv.container;
const style = document.createElement('style');
style.textContent = `
.kb-wrap{position:relative; display:grid; gap:8px; font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;}
.kb-focus{padding:6px 8px; border:1px dashed rgba(255,255,255,.25); border-radius:8px; color:#bbb; font-size:12px;}
.kb-focus:focus{outline:none; border-color:#6aa9ff; box-shadow:0 0 0 2px rgba(106,169,255,.25) inset;}
.kb-row{display:flex; gap:10px; align-items:center;}
.kb-mini{font-size:11px; color:#aaa}
.kb-canvas{border-radius:10px; display:block; background:#0c0f14; border:1px solid rgba(255,255,255,.06)}
`;
document.head.appendChild(style);

const wrap = document.createElement('div'); wrap.className='kb-wrap';
root.appendChild(wrap);

const focusBox = document.createElement('div');
focusBox.className='kb-focus';
focusBox.tabIndex = 0;
focusBox.textContent = 'Click here and press keys. Shows event.key, event.code, ASCII, and modifiers (Shift, Alt, Ctrl, Meta).';
wrap.appendChild(focusBox);

const row = document.createElement('div'); row.className='kb-row'; wrap.appendChild(row);

const canvas = document.createElement('canvas');
const CAP_W = 840, CAP_H = 420;
const SCALE = 0.9;
canvas.className='kb-canvas';
canvas.width = CAP_W; canvas.height = CAP_H;
canvas.style.width = Math.round(CAP_W*SCALE)+'px';
canvas.style.height = Math.round(CAP_H*SCALE)+'px';
row.appendChild(canvas);

const ctx = canvas.getContext('2d');

// ---------- state ----------
let focused = false;
let lastEvents = []; // {type, key, code, ascii, shift, alt, ctrl, meta, time}
const pressed = new Map(); // code -> {key, ascii}
const modifiers = {shift:false, alt:false, ctrl:false, meta:false};
const maxLog = 10;

function asciiOf(key){
  if(typeof key!=='string') return null;
  if(key.length===1){ return key.codePointAt(0); }
  return null;
}

// ---------- handlers ----------
function onFocus(){ focused = true; }
function onBlur(){ focused = false; pressed.clear(); modifiers.shift=modifiers.alt=modifiers.ctrl=modifiers.meta=false; }

function pushEvent(e, type){
  const entry = {
    type,
    key: e.key,
    code: e.code,
    ascii: asciiOf(e.key),
    shift: e.shiftKey,
    alt: e.altKey,
    ctrl: e.ctrlKey || e.ctrlKey===true, // keep boolean
    meta: e.metaKey,
    time: new Date()
  };
  lastEvents.unshift(entry);
  if(lastEvents.length>maxLog) lastEvents.pop();
}

function handleDown(e){
  // Allow Esc to focus this panel (avoids Obsidian capture sometimes)
  if(e.key==='Escape') { focusBox.focus(); }
  modifiers.shift = e.shiftKey; modifiers.alt = e.altKey; modifiers.ctrl = e.ctrlKey; modifiers.meta = e.metaKey;
  pressed.set(e.code, {key:e.key, ascii:asciiOf(e.key)});
  pushEvent(e,'keydown');
  // Prevent default for testing if desired (commented):
  // e.preventDefault();
}
function handleUp(e){
  modifiers.shift = e.shiftKey; modifiers.alt = e.altKey; modifiers.ctrl = e.ctrlKey; modifiers.meta = e.metaKey;
  pressed.delete(e.code);
  pushEvent(e,'keyup');
}

focusBox.addEventListener('focus', onFocus);
focusBox.addEventListener('blur', onBlur);

// Listen on both the focus box and window to maximize catch rate
['keydown','keyup'].forEach(t=>{
  focusBox.addEventListener(t, (e)=> { t==='keydown'?handleDown(e):handleUp(e); }, {passive:false});
  window.addEventListener(t, (e)=> { if(focused) { t==='keydown'?handleDown(e):handleUp(e); } }, {passive:false});
});

// ---------- drawing ----------
function roundRect(x,y,w,h,r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}

function chip(x,y,text,active=false){
  const padX=8, padY=4; ctx.save();
  ctx.font='12px ui-monospace, monospace';
  const w = ctx.measureText(text).width + padX*2;
  const h = 20;
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = active? '#16324a' : '#121820';
  roundRect(x,y,w,h,6); ctx.fill();
  ctx.strokeStyle = active? '#4aa3ff' : 'rgba(255,255,255,0.08)'; ctx.stroke();
  ctx.fillStyle = active? '#9ed0ff' : '#aab';
  ctx.fillText(text, x+padX, y+14);
  ctx.restore();
  return w;
}

function render(){
  // bg
  ctx.clearRect(0,0,CAP_W,CAP_H);
  ctx.fillStyle = '#0c0f14';
  ctx.fillRect(0,0,CAP_W,CAP_H);

  // title
  ctx.fillStyle='#c9d1d9';
  ctx.font='16px ui-monospace, monospace';
  ctx.fillText('Keyboard Inspector (DataviewJS)', 16, 28);
  ctx.font='12px ui-monospace, monospace';
  ctx.fillStyle='#8892a6';
  ctx.fillText(focused ? 'focused: capturing keys' : 'not focused: click the box above to capture', 16, 46);

  // modifiers row
  let x = 16, y = 66;
  x += chip(x,y, 'Shift', modifiers.shift)+8;
  x += chip(x,y, 'Alt', modifiers.alt)+8;
  x += chip(x,y, 'Ctrl', modifiers.ctrl)+8;
  x += chip(x,y, 'Meta', modifiers.meta)+8;

  // currently pressed keys grid
  ctx.font='13px ui-monospace, monospace';
  ctx.fillStyle='#aab';
  ctx.fillText('pressed:', 16, 98);

  const keys = [...pressed.entries()].map(([code,info])=>({code, ...info}));
  const colW = 200, colH = 44;
  const cols = 3;
  keys.slice(0,9).forEach((k,i)=>{
    const cx = 16 + (i%cols)*colW;
    const cy = 110 + Math.floor(i/cols)*colH;
    // card
    ctx.save();
    roundRect(cx, cy, colW-12, colH-8, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
    // content
    ctx.fillStyle='#bcd';
    ctx.font='14px ui-monospace, monospace';
    const keyStr = (k.key && k.key.length===1) ? `'${k.key}'` : String(k.key);
    ctx.fillText(`key=${keyStr}`, cx+10, cy+18);
    ctx.fillStyle='#8aa';
    ctx.font='12px ui-monospace, monospace';
    ctx.fillText(`code=${k.code}`, cx+10, cy+33);
    ctx.fillText(`ascii=${k.ascii===null?'∅':k.ascii}`, cx+115, cy+33);
    ctx.restore();
  });

  // last events table
  const tableX = 16, tableY = 240, rowH = 20, tableW = CAP_W - 32;
  ctx.fillStyle='#aab'; ctx.font='13px ui-monospace, monospace';
  ctx.fillText('recent events:', tableX, tableY-10);
  // header
  ctx.fillStyle='rgba(255,255,255,0.04)';
  roundRect(tableX, tableY, tableW, rowH, 6); ctx.fill();
  ctx.fillStyle='#9fb';
  ctx.font='12px ui-monospace, monospace';
  const colsSpec = [
    {w:80, name:'type'},
    {w:130, name:'key'},
    {w:140, name:'code'},
    {w:90, name:'ascii'},
    {w:70, name:'Shift'},
    {w:60, name:'Alt'},
    {w:60, name:'Ctrl'},
    {w:70, name:'Meta'},
    {w:160, name:'time'}
  ];
  let tx = tableX+10;
  colsSpec.forEach(c=>{ ctx.fillText(c.name, tx, tableY+14); tx += c.w; });

  // rows
  lastEvents.slice(0,maxLog).forEach((ev,i)=>{
    const ry = tableY + (i+1)*rowH;
    ctx.fillStyle= i%2? 'rgba(255,255,255,0.02)':'rgba(255,255,255,0.01)';
    roundRect(tableX, ry, tableW, rowH, 6); ctx.fill();
    tx = tableX+10; ctx.fillStyle='#c9d1d9'; ctx.font='12px ui-monospace, monospace';
    const cells = [
      ev.type,
      (ev.key && ev.key.length===1) ? `'${ev.key}'` : String(ev.key),
      ev.code,
      (ev.ascii===null?'∅':String(ev.ascii)),
      ev.shift?'1':'0',
      ev.alt?'1':'0',
      ev.ctrl?'1':'0',
      ev.meta?'1':'0',
      ev.time.toLocaleTimeString()
    ];
    colsSpec.forEach((c,idx)=>{
      ctx.fillText(String(cells[idx]).slice(0,24), tx, ry+14);
      tx += c.w;
    });
  });

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// convenience: auto-focus when clicking canvas too
canvas.addEventListener('click', ()=> focusBox.focus());
```
