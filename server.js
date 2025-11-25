import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Load env vars only if running locally
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Use environment variable for model if provided, otherwise default to Mixtral-8B
const MODEL = process.env.GROQ_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct;

app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    const reply = completion.choices?.[0]?.message?.content || "No response from AI.";
    res.json({ reply });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI request failed." });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Cube.AI server running on port ${port}`));



