/* หน้าสรุปผล: อ่านผลจาก sessionStorage ที่ game.js บันทึกไว้ */
const app=document.getElementById("app");
const R=load("pdw-result",null,sessionStorage);

if(!R){location.href="index.html"}
else if(R.review){
  app.innerHTML=`<div class="panel center"><h2>ทบทวนครบแล้ว</h2>
  <p class="mute">ตอบถูกครบทุกคำที่เคยพลาด</p><a class="btn primary" href="index.html">กลับเมนู</a></div>`;
}else{
  const missed=R.missed.map(w=>dict.get(w)).filter(Boolean);
  app.innerHTML=`<div class="panel center"><p class="mute">คะแนนรอบนี้</p><div class="big">${R.score} / ${R.total*10}</div></div>
  ${missed.length?`<div class="panel"><h2>คำที่พลาด</h2><ul>${missed.map(o=>
    `<li><span class="x">${esc(o.w)}</span> <span class="good">${esc(o.c)}</span> <span class="mute">${esc(o.n)}</span></li>`).join("")}</ul>
    <div style="margin-top:12px"><a class="btn" href="game.html?mode=review&src=round">ทบทวนคำที่พลาด</a></div></div>`
    :'<div class="panel"><h2>ไม่พลาดเลยสักคำ</h2></div>'}
  <div class="panel"><h2>บันทึกคะแนน</h2>
  <input type="text" id="nm" maxlength="16" placeholder="ชื่อของคุณ" aria-label="ชื่อ">
  <div class="row"><button class="primary" id="sv">บันทึกคะแนน</button><a class="btn" href="index.html">กลับเมนูโดยไม่บันทึก</a></div></div>`;
  document.getElementById("sv").onclick=()=>{
    const name=document.getElementById("nm").value.trim()||"ไม่ระบุชื่อ";
    const board=load("pdw-board",[]);
    board.push({n:name,s:R.score,d:new Date().toLocaleDateString("th-TH")});
    save("pdw-board",mergeSort(board,(x,y)=>y.s-x.s).slice(0,10)); // Merge Sort จัดอันดับ
    location.href="index.html";
  };
}
