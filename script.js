const synth = window.speechSynthesis;

const startBtn = document.getElementById("startBtn");
const chatUI = document.getElementById("chatUI");
const textInput = document.getElementById("textInput");

// Start Liya
startBtn.addEventListener("click", () => {
  speakBrowser(
    "Namaste, main Liya hoon. Main taiyaar hoon. Aap mujhse baat kar sakte ho."
  );
  chatUI.classList.remove("hidden");
  startListening();
});

// Browser voice (welcome / fallback)
function speakBrowser(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "hi-IN";
  synth.cancel();
  synth.speak(msg);
}

// Voice input
function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    speakBrowser("Aapka browser voice support nahi karta.");
    return;
  }

  const recog = new SR();
  recog.lang = "hi-IN";
  recog.start();

  recog.onresult = async (e) => {
    const userText = e.results[0][0].transcript;
    const audio = await askAI(userText);
    playAudio(audio);
    setTimeout(startListening, 4000);
  };
}

// Text input
async function textSend() {
  if (!textInput.value.trim()) return;

  const audio = await askAI(textInput.value);
  playAudio(audio);
  textInput.value = "";
}
window.textSend = textSend;

// Call backend AI
async function askAI(text) {
  const res = await fetch("/.netlify/functions/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  return data.audio;
}

// Play ElevenLabs audio
function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
}
