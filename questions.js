/* ไฟล์กลาง: คลังคำ + โครงสร้างข้อมูล + อัลกอริทึม + ตัวช่วย (โหลดทุกหน้า) */

/* ===== คลังคำ: [คำถูก, คำที่มักเขียนผิด, คำใบ้, เหตุผล] ===== */
const WORDS=[
["สังเกต","สังเกตุ","ดูอย่างตั้งใจ","เกต ไม่มีสระอุ"],
["อนุญาต","อนุญาติ","ยอมให้ทำได้","ลงท้ายด้วย ต ไม่มีสระอิ"],
["เบญจเพส","เบญจเพศ","อายุ 25 ปีตามความเชื่อไทย","มาจาก เบญจ (ห้า) + วีส (ยี่สิบ) จึงใช้ ส"],
["กะทันหัน","กระทันหัน","เกิดขึ้นโดยไม่ทันตั้งตัว","ใช้ กะ ไม่มี ร เรือ"],
["เฉพาะ","เฉพราะ","จำกัดเพียงบางอย่าง","ไม่มี ร เรือ"],
["ลายเซ็น","ลายเซ็นต์","ชื่อที่ลงด้วยลายมือ","ลงท้ายด้วย น ไม่มี ต์"],
["นะคะ","นะค่ะ","ท้ายประโยคขอร้องหรือคำถาม","คะ ในคำถามและคำขอร้องไม่มีไม้เอก ส่วน ค่ะ ใช้ตอบรับ"],
["ไอศกรีม","ไอศครีม","ขนมเย็นทำจากนม","กรีม ใช้ ก ไก่ + ร เรือ"],
["ฉะนั้น","ฉนั้น","ดังนั้น","ต้องมีสระอะที่ ฉ"],
["เทศกาล","เทสกาล","ช่วงเวลาจัดงานรื่นเริง","เทศ ใช้ ศ ศาลา"],
["สัมภาษณ์","สัมภาษ","พูดคุยถามตอบเพื่อหาข้อมูล","ลงท้ายด้วย ณ์"],
["อาถรรพ์","อาถรรพ","เรื่องลึกลับน่ากลัว","ลงท้ายด้วย พ์"],
["บัญชี","บันชี","รายการรับจ่ายเงิน","สะกดด้วย ญ หญิง"],
["ปรากฏ","ปรากฎ","เห็นได้ชัด","ลงท้ายด้วย ฏ ปฏัก"],
["กิจวัตร","กิจวัต","สิ่งที่ทำเป็นประจำ","ลงท้ายด้วย ตร"],
["สะดวก","สดวก","คล่องตัว ไม่ติดขัด","มีสระอะที่ ส"],
["ภาพยนตร์","ภาพยนต์","หนังที่ฉายในโรง","ลงท้ายด้วย ตร์"],
["คริสต์มาส","คริสมาส","เทศกาลวันที่ 25 ธันวาคม","มี ต์ หลัง ส"],
["ประสบการณ์","ประสพการณ์","สิ่งที่เคยผ่านมา","ใช้ สบ ไม่ใช่ สพ"],
["สีสัน","สีสรร","ความหลากหลายของสี","สัน ใช้ น หนู"],
["จัดสรร","จัดสรรค์","แบ่งให้ตามส่วน","ลงท้ายด้วย ร ไม่มี ค์"],
["พิสูจน์","พิสูจน","ทดสอบให้เห็นจริง","ลงท้ายด้วย จน์"]
];

/* ===== โครงสร้างข้อมูล 1: Hash Table (แยกกลุ่มด้วย chaining) ===== */
class HashTable{
  constructor(n=31){this.buckets=Array.from({length:n},()=>[])}
  hash(key){let h=5381;for(const ch of key)h=((h<<5)+h+ch.codePointAt(0))>>>0;return h%this.buckets.length}
  set(key,val){const b=this.buckets[this.hash(key)];for(const e of b){if(e[0]===key){e[1]=val;return}}b.push([key,val])}
  get(key){for(const e of this.buckets[this.hash(key)])if(e[0]===key)return e[1];return undefined}
}

/* ===== โครงสร้างข้อมูล 2: Queue ===== */
class Queue{
  constructor(){this.a=[];this.head=0}
  enqueue(x){this.a.push(x)}
  dequeue(){return this.a[this.head++]}
  get size(){return this.a.length-this.head}
}

/* ===== อัลกอริทึม 1: Merge Sort (cmp กำหนดลำดับ) ===== */
function mergeSort(arr,cmp){
  if(arr.length<=1)return arr;
  const m=arr.length>>1,L=mergeSort(arr.slice(0,m),cmp),R=mergeSort(arr.slice(m),cmp),out=[];
  let i=0,j=0;
  while(i<L.length&&j<R.length)out.push(cmp(L[i],R[j])<=0?L[i++]:R[j++]);
  return out.concat(L.slice(i),R.slice(j));
}

/* ===== อัลกอริทึม 2: Edit Distance (Dynamic Programming) ===== */
function editDistance(a,b){
  const A=[...a],B=[...b],dp=Array.from({length:A.length+1},(_,i)=>[i,...Array(B.length).fill(0)]);
  for(let j=0;j<=B.length;j++)dp[0][j]=j;
  for(let i=1;i<=A.length;i++)for(let j=1;j<=B.length;j++)
    dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(A[i-1]===B[j-1]?0:1));
  return dp[A.length][B.length];
}

/* ===== สร้างตารางข้อมูลจากคลังคำ ===== */
const dict=new HashTable();       // คำถูก -> ข้อมูลคำ
const wrongIndex=new HashTable(); // คำผิด -> คำถูก
for(const [c,w,h,n] of WORDS){dict.set(c,{c,w,h,n});wrongIndex.set(w,c)}

/* ===== ตัวช่วยทั่วไป ===== */
const load=(k,d,store=localStorage)=>{try{return JSON.parse(store.getItem(k))||d}catch(e){return d}};
const save=(k,v,store=localStorage)=>{try{store.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* คำที่เคยพลาด เรียงจากพลาดมากไปน้อย */
const topMissed=n=>mergeSort(Object.entries(load("pdw-miss",{})),(a,b)=>b[1]-a[1]).slice(0,n);
