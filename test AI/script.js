const API_KEY = "AIzaSyB4SkbryYoBYTGaMXrbXXDEoo5txCrPiRM";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const chatbox = document.getElementById("chatbox");
const input = document.getElementById("question");
const sendBtn = document.getElementById("sendBtn");

async function askGemini() {
  const prompt = input.value.trim();
  if (!prompt) return;

  appendMessage("user", prompt);
  input.value = "";
  sendBtn.disabled = true;
  appendLoading();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban.";
    removeLoading();
    appendMessage("ai", answer);
  } catch (err) {
    removeLoading();
    appendMessage("ai", "**Error:** gagal menghubungi Gemini.");
    console.error(err);
  } finally {
    sendBtn.disabled = false;
  }
}

/* ---------- UI helper ---------- */
function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  const bubble = document.createElement("span");
  bubble.className = "bubble";

  // Render Markdown → HTML
  bubble.innerHTML = marked.parse(text);

  div.appendChild(bubble);
  chatbox.appendChild(div);
  scrollBottom();
  hljs.highlightAll(); // highlight code blocks
}

function appendLoading() {
  const div = document.createElement("div");
  div.id = "loading";
  div.className = "msg ai";
  div.innerHTML = '<div class="bubble"><div class="spinner"></div></div>';
  chatbox.appendChild(div);
  scrollBottom();
}

function removeLoading() {
  document.getElementById("loading")?.remove();
}

function scrollBottom() {
  chatbox.scrollTop = chatbox.scrollHeight;
}
