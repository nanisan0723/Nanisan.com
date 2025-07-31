const correctAnswer = "apple";

function startRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US"; // 回答は英語
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    document.getElementById("answerText").textContent = transcript;
    checkAnswer(transcript);
  };

  recognition.onerror = (event) => {
    document.getElementById("answerText").textContent = "エラー: " + event.error;
    document.getElementById("judge").textContent = "";
  };
}

function checkAnswer(answer) {
  if (answer === correctAnswer) {
    document.getElementById("judge").textContent = "✅ 正解！";
  } else {
    document.getElementById("judge").textContent = "❌ 不正解";
  }
}
