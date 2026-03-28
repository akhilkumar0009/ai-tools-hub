const express = require("express");
const cors = require("cors");
require("dotenv").config(); // 👈 IMPORTANT

const app = express();

app.use(express.json());
app.use(cors());

app.post("/generate", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // 👈 SECURE API
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a stylish Instagram bio generator. Add emojis and make it attractive."
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 Safety check
    if (!data.choices) {
      console.log(data);
      return res.json({ result: "❌ API Error" });
    }

    res.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.json({ result: "❌ Server error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});