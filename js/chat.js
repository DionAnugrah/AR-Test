const GEMINI_KEY = "AIzaSyB4SkbryYoBYTGaMXrbXXDEoo5txCrPiRM";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`;

const toggleBtn = document.getElementById("chat-toggle");
const panel = document.getElementById("chat-panel");
const messages = document.getElementById("chat-messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

toggleBtn.addEventListener("click", () => {
  panel.style.display = panel.style.display === "flex" ? "none" : "flex";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";
  appendMessage("ai", "<em>Mengetik...</em>");

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
      }),
    });
    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban.";
    replaceLastMessage("ai", reply);
  } catch (err) {
    replaceLastMessage("ai", "❌ Gagal menghubungi AI.");
    console.error(err);
  }
});

function appendMessage(sender, html) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.innerHTML = html;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function replaceLastMessage(sender, html) {
  const last = messages.lastChild;
  last.innerHTML = html;
  messages.scrollTop = messages.scrollHeight;
}
