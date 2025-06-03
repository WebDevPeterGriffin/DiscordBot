const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("static")); // serve HTML from static folder

app.post("/setquiz", (req, res) => {
  const { question, options, answer } = req.body;

  if (
    !question ||
    !Array.isArray(options) ||
    options.length !== 4 ||
    !["A", "B", "C", "D"].includes(answer)
  ) {
    return res.status(400).json({ error: "Invalid quiz format" });
  }

  const quiz = { question, options, answer };
  fs.writeFileSync("quizzes.json", JSON.stringify(quiz, null, 2));

  res.json({ message: "✅ Quiz saved successfully" });
});

app.get("/", (_, res) => res.send("Bot is alive"));

app.listen(3000, () => {
  console.log("🌐 Express server running");
});
