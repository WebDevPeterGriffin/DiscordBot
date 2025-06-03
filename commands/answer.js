const { SlashCommandBuilder } = require("discord.js");

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
    if (userAnswer === "C") {
      await interaction.reply(
        `✅ Correct, <@${interaction.user.id}>! You earn +1 XP.`,
      );
    } else {
      await interaction.reply(`❌ Sorry, that’s not it.`);
    }
  },
};
