const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(".")); // serve index.html
app.use(express.json());

const QUIZ_PATH = path.join(__dirname, "quizzes.json");

app.post("/save-quiz", (req, res) => {
  const { question, options, answer } = req.body;

  // Validate format
  if (
    !question ||
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 5
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid number of options (2–5 required).",
    });
  }

  if (!Array.isArray(answer) || answer.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "At least one correct answer required." });
  }

  const quiz = {
    question: question.trim(),
    options: options.map((o) => o.trim()),
    answer: answer.map((a) => a.toUpperCase()),
  };

  try {
    fs.writeFileSync(QUIZ_PATH, JSON.stringify(quiz, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to write quiz:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(3000, () => {
  console.log("🌐 Express server running");
});
