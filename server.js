// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `You are Cube AI, a fast and clever coding assistant. Always answer precisely without repeating or filler text.\nUser: ${message}\nCube AI:`,
        max_tokens: 300,
        temperature: 0.3
      })
    });

    const data = await response.json();
    const aiText = data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : "No response";
    res.json({ aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Cube AI backend running on port ${PORT}`));
