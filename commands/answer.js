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
        .setDescription("Your answer (A/B/C/D)")
        .setRequired(true),
    ),

  async execute(interaction) {
    const userAnswer = interaction.options.getString("option").toUpperCase();

    try {
      const quizPath = path.join(__dirname, "../quizzes.json");
      const quiz = JSON.parse(fs.readFileSync(quizPath, "utf-8"));
      const correct = quiz.answer.toUpperCase();

      if (userAnswer === correct) {
        await interaction.reply(
          `✅ Correct, <@${interaction.user.id}>! You earn +1 XP.`,
        );
      } else {
        await interaction.reply(`❌ Nope — that’s not it.`);
      }
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Could not read the quiz file.",
        ephemeral: true,
      });
    }
  },
};
