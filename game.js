/* หน้าเล่นเกม: ?mode=choose | type | review  (review ใช้ &src=stats หรือ round) */
const params=new URLSearchParams(location.search);
const app=document.getElementById("app");
let S=null;

function start(){
  const m=params.get("mode")||"choose";
  const q=new Queue();
  const review=m==="review";
  if(review){
    const words=params.get("src")==="round"
      ?load("pdw-result",{missed:[]},sessionStorage).missed
      :topMissed(8).map(e=>e[0]);
    for(const w of words){const o=dict.get(w);if(o)q.enqueue(o)}
  }else{
    for(const w of shuffle(WORDS).slice(0,10))q.enqueue(dict.get(w[0]));
  }
  if(q.size===0){location.href="index.html";return}
  S={q,mode:review?"choose":m,review,total:q.size,n:0,score:0,missed:[]};
  ask();
}

function ask(){
  const o=S.cur=S.q.dequeue();S.n++;
  const head=`<a class="back" href="index.html">กลับเมนู</a>
  <div class="top"><span>${S.review?"ทบทวน":"ข้อ "+Math.min(S.n,S.total)+" / "+S.total}</span><span>คะแนน ${S.score}</span></div>`;
  if(S.mode==="choose"){
    const pair=shuffle([o.c,o.w]);
    app.innerHTML=`<div class="panel">${head}<h2>คำไหนเขียนถูก</h2><p class="hint mute">ใบ้: ${esc(o.h)}</p>
    <div class="opts">${pair.map(p=>`<button data-a="${esc(p)}">${esc(p)}</button>`).join("")}</div><div id="fb"></div></div>`;
    app.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{
      app.querySelectorAll("[data-a]").forEach(x=>x.disabled=true);
      judge(b.dataset.a===o.c?"ok":"bad",b.dataset.a);
    });
  }else{
    app.innerHTML=`<div class="panel">${head}<h2>พิมพ์คำที่เขียนถูก</h2>
    <p class="hint">ใบ้: ${esc(o.h)} <span class="mute">(${[...o.c].length} ตัวอักษร)</span></p>
    <input type="text" id="in" autocomplete="off" aria-label="คำตอบ">
    <div class="row"><button class="primary" id="go">ตรวจคำตอบ</button></div><div id="fb"></div></div>`;
    const inp=document.getElementById("in");inp.focus();
    const go=()=>{
      const v=inp.value.trim();if(!v)return;
      inp.disabled=true;document.getElementById("go").disabled=true;
      if(v===o.c)return judge("ok",v);
      const d=editDistance(v,o.c);          // DP: ผิดไปกี่ตัวอักษร
      judge(d<=1?"near":"bad",v,d);
    };
    document.getElementById("go").onclick=go;
    inp.onkeydown=e=>{if(e.key==="Enter")go()};
  }
}

function judge(res,ans,dist){
  const o=S.cur;
  if(res==="ok")S.score+=10;else if(res==="near")S.score+=5;
  const st=load("pdw-miss",{});
  if(res!=="ok"){
    if(S.review){S.q.enqueue(o);S.total++}   // ทบทวน: ใส่กลับท้าย Queue ให้เจออีก
    else S.missed.push(o.c);
    st[o.c]=(st[o.c]||0)+1;save("pdw-miss",st);
  }else if(S.review&&st[o.c]){
    st[o.c]--;if(st[o.c]<=0)delete st[o.c];save("pdw-miss",st);
  }
  const known=wrongIndex.get(ans);            // Hash Table: เป็นคำผิดของคำไหน
  const label={ok:"ถูกต้อง",near:"เกือบถูก (ผิดไป "+dist+" ตัวอักษร)",bad:"ยังไม่ถูก"}[res];
  document.getElementById("fb").innerHTML=`<div class="fb ${res}"><b>${label}</b>
  <p style="margin:6px 0">คำที่ถูกคือ <span class="good">${esc(o.c)}</span>${res!=="ok"?` ไม่ใช่ <span class="x">${esc(ans)}</span>`:""}</p>
  <p class="mute" style="margin:0 0 12px">เหตุผล: ${esc(o.n)}</p>
  ${known&&known!==o.c?`<p class="mute">คำที่พิมพ์เป็นคำผิดของ ${esc(known)}</p>`:""}
  <button class="primary" id="nx">${S.q.size>0?"ข้อต่อไป":"ดูผล"}</button></div>`;
  const nx=document.getElementById("nx");nx.focus();
  nx.onclick=()=>S.q.size>0?ask():finish();
}

function finish(){
  save("pdw-result",{review:S.review,score:S.score,total:S.total,missed:S.missed},sessionStorage);
  location.href="result.html";
}
start();
