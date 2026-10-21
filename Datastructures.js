/* โครงสร้างข้อมูลและอัลกอริทึมทั้งหมด (Linked List, Queue, Stack, Merge Sort, BST, Traversal) */
/* ===== 2) LINKED LIST + 3) QUEUE: คิวข้อสอบ สร้างจาก Linked List ===== */
class ListNode{constructor(v){this.v=v;this.next=null}}
class LinkedQueue{
  constructor(){this.head=null;this.tail=null;this.size=0}
  enqueue(v){const n=new ListNode(v);if(this.tail)this.tail.next=n;else this.head=n;this.tail=n;this.size++}
  dequeue(){if(!this.head)return null;const v=this.head.v;this.head=this.head.next;if(!this.head)this.tail=null;this.size--;return v}
}

/* ===== 4) STACK: เก็บคำที่ตอบผิด แล้ว pop มาแสดง (ล่าสุดก่อน) ===== */
class Stack{
  constructor(){this.a=[]}
  push(v){this.a.push(v)}
  pop(){return this.a.pop()}
  isEmpty(){return this.a.length===0}
}

/* ===== 5) RECURSION + 6) DIVIDE & CONQUER + 7) SORTING: Merge Sort ===== */
function mergeSort(arr,better){
  if(arr.length<=1)return arr;                 // base case
  const mid=arr.length>>1;
  const L=mergeSort(arr.slice(0,mid),better);   // Divide
  const R=mergeSort(arr.slice(mid),better);
  const out=[];let i=0,j=0;                     // Conquer (merge)
  while(i<L.length&&j<R.length)out.push(better(R[j],L[i])?R[j++]:L[i++]);
  while(i<L.length)out.push(L[i++]);
  while(j<R.length)out.push(R[j++]);
  return out;
}

/* ===== 8) BST + 9) TRAVERSAL: จัดอันดับ Leaderboard ===== */
const better=(a,b)=>a.score>b.score||(a.score===b.score&&a.time<b.time);
function bstInsert(node,e){
  if(!node)return{e,l:null,r:null};
  if(better(e,node.e))node.r=bstInsert(node.r,e);  // คะแนนดีกว่าไปขวา
  else node.l=bstInsert(node.l,e);
  return node;
}
function reverseInorder(n,out,limit){            // ขวา -> ราก -> ซ้าย = ดีสุดไปน้อยสุด
  if(!n||out.length>=limit)return;
  reverseInorder(n.r,out,limit);
  if(out.length<limit)out.push(n.e);
  reverseInorder(n.l,out,limit);
}
