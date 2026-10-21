/* ตรรกะเกมและการแสดงผล */
/* ===== ตัวช่วย ===== */
const $=id=>document.getElementById(id);
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function show(id){["s-start","s-game","s-result","s-board"].forEach(s=>$(s).classList.toggle("hide",s!==id))}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ===== ตัวเกม ===== */
const TOTAL=10,LIMIT=10;
let queue,wrongStack,score,correct,qn,player,cur,t0,timer,locked,gameStart;

function startGame(){
  player=$("name").value.trim();
  if(!player){show("s-start");$("name").focus();$("name").placeholder="กรุณาใส่ชื่อก่อนนะ";return}
  queue=new LinkedQueue();wrongStack=new Stack();
  shuffle([...WORDS.keys()]).slice(0,TOTAL).forEach(w=>queue.enqueue(w));
  score=0;correct=0;qn=0;gameStart=Date.now();
  show("s-game");nextQ();
}

function nextQ(){
  const w=queue.dequeue();
  if(w===null)return finish();
  qn++;cur=w;locked=false;
  $("fb").classList.add("hide");
  $("qno").textContent="ข้อ "+qn+"/"+TOTAL;
  $("score").textContent="⭐ "+score;
  const opts=shuffle([w,WORDS.get(w).wrong]);
  [0,1].forEach(i=>{const b=$("b"+i);b.textContent=opts[i];b.onclick=()=>answer(opts[i])});
  t0=Date.now();clearInterval(timer);
  timer=setInterval(tick,50);tick();
}

function tick(){
  const left=Math.max(0,LIMIT-(Date.now()-t0)/1000);
  $("fill").style.width=(left/LIMIT*100)+"%";
  $("tleft").textContent="⏱ "+left.toFixed(1);
  if(left<=0)answer(null);
}

function answer(choice){
  if(locked)return;locked=true;clearInterval(timer);
  const left=Math.max(0,LIMIT-(Date.now()-t0)/1000);
  if(choice===cur){                              // ถูก -> ไปข้อถัดไปทันที
    score+=100+Math.round(left*10);correct++;    // 100 + โบนัสเวลา (สูงสุด 100)
    nextQ();
  }else{                                         // ผิด/หมดเวลา -> โชว์เฉลยสั้นๆ
    wrongStack.push(cur);
    const m=load("wg_miss",{});m[cur]=(m[cur]||0)+1;save("wg_miss",m);
    const fb=$("fb");
    fb.innerHTML=(choice===null?"⏰ หมดเวลา! ":"❌ ผิด! ")+"คำที่ถูกคือ <b>"+esc(cur)+"</b><br><small>"+esc(WORDS.get(cur).note)+"</small>";
    fb.classList.remove("hide");
    setTimeout(nextQ,1800);
  }
}

function finish(){
  const time=Math.round((Date.now()-gameStart)/1000);
  const lb=load("wg_lb",[]);
  lb.push({name:player,score,time});save("wg_lb",lb);
  $("rname").textContent="ผู้เล่น: "+player;
  $("rscore").textContent=score+" คะแนน";
  $("rinfo").textContent="ถูก "+correct+"/"+TOTAL+" ข้อ · ใช้เวลา "+time+" วินาที";
  let html="";
  while(!wrongStack.isEmpty()){                  // pop ออกมาทีละคำ
    const w=wrongStack.pop(),d=WORDS.get(w);
    html+='<div class="wrong"><s>'+esc(d.wrong)+'</s> → <b>'+esc(w)+'</b><br><small>'+esc(d.note)+'</small></div>';
  }
  $("rwrong").innerHTML=html||"<p>🎊 ถูกหมดทุกข้อ เก่งมาก!</p>";
  show("s-result");
}

function showBoard(){
  let root=null;
  load("wg_lb",[]).forEach(e=>root=bstInsert(root,e)); // สร้าง BST
  const top=[];reverseInorder(root,top,10);            // traversal ได้ Top 10
  const medal=["🥇","🥈","🥉"];
  $("lb").innerHTML="<tr><th>#</th><th>ชื่อ</th><th>คะแนน</th><th>เวลา</th></tr>"+
    (top.map((e,i)=>"<tr><td>"+(medal[i]||i+1)+"</td><td>"+esc(e.name)+"</td><td>"+e.score+"</td><td>"+e.time+" วิ</td></tr>").join("")
    ||'<tr><td colspan="4">ยังไม่มีคะแนน มาเป็นคนแรกกัน!</td></tr>');
  const m=load("wg_miss",{});
  const arr=Object.keys(m).map(w=>({w,n:m[w]}));
  const sorted=mergeSort(arr,(a,b)=>a.n>b.n).slice(0,5);  // เรียงด้วย Merge Sort
  $("miss").innerHTML="<tr><th>คำ</th><th>พลาดกี่ครั้ง</th></tr>"+
    (sorted.map(x=>"<tr><td>"+esc(x.w)+"</td><td>"+x.n+"</td></tr>").join("")
    ||'<tr><td colspan="2">ยังไม่มีข้อมูล</td></tr>');
  show("s-board");
}
