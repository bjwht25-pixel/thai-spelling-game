
const score = Number(localStorage.getItem("quizScore") || 0);
const correct = Number(localStorage.getItem("quizCorrect") || 0);
const total = Number(localStorage.getItem("quizTotal") || 10);

document.getElementById("finalScore").textContent =
  `${score}/100 คะแนน`;

document.getElementById("correctCount").textContent =
  `ตอบถูก ${correct} จาก ${total} ข้อ`;

let emoji;
let message;

if (score === 100) {
  emoji = "🏆";
  message = "ยอดเยี่ยม! คุณสะกดคำถูกทุกข้อ";
} else if (score >= 70) {
  emoji = "🌟";
  message = "เก่งมาก! ฝึกอีกนิดก็เก่งขึ้นได้";
} else {
  emoji = "💪";
  message = "ลองเล่นอีกครั้ง แล้วจำคำที่เฉลยให้ได้นะ";
}

document.getElementById("emoji").textContent = emoji;
document.getElementById("message").textContent = message;

