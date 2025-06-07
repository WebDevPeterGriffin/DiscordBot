const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("answer")
    .setDescription("Submit your quiz answer")
    .addStringOption((opt) =>
      opt
        .setName("option")
        .setDescription("Your answer (e.g. A, C or AC)")
        .setRequired(true),
    ),

  async execute(interaction) {
    const input = interaction.options
      .getString("option")
      .toUpperCase()
      .replace(/[^A-E]/g, "");
    const userAnswers = [...new Set(input.split(""))].sort(); // Remove duplicates & sort

    try {
      const quizPath = path.join(__dirname, "../quizzes.json");
      const quiz = JSON.parse(fs.readFileSync(quizPath, "utf-8"));

      const correctAnswers = Array.isArray(quiz.answer)
        ? quiz.answer.map((a) => a.toUpperCase()).sort()
        : [quiz.answer.toUpperCase()];

      const isFullyCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((val, idx) => val === correctAnswers[idx]);

      const isPartiallyCorrect = userAnswers.some((letter) =>
        correctAnswers.includes(letter),
      );

      if (isFullyCorrect) {
        await interaction.reply(
          `🎯 Perfect, <@${interaction.user.id}>! You nailed all correct answers! +2 XP.`,
        );
      } else if (isPartiallyCorrect) {
        await interaction.reply(
          `✅ Not bad, <@${interaction.user.id}>! You got at least one right. +1 XP.`,
        );
      } else {
        await interaction.reply(`❌ Nope — that’s not it.`);
      }
    } catch (err) {
      console.error("❌ Error in /answer:", err);
      await interaction.reply({
        content: "❌ Could not read the quiz file.",
        ephemeral: true,
      });
    }
  },
};
