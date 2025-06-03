const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("Post the current quiz"),

  async execute(interaction) {
    // 👮 Role and permission check
    const allowedRoles = [
      "1353401702522421358", // Moderator
      "1353401445755654244", // Admin
    ];

    const member = await interaction.guild.members.fetch(interaction.user.id);

    const isAllowed = member.roles.cache.some((role) =>
      allowedRoles.includes(role.id),
    );

    const isOwner = interaction.guild.ownerId === interaction.user.id;

    if (!isAllowed && !isOwner) {
      return interaction.reply({
        content:
          "🚫 Only Admins, Moderators, or the Server Owner can use this command.",
        ephemeral: true,
      });
    }

    try {
      const quizPath = path.join(__dirname, "../quizzes.json");
      const quiz = JSON.parse(fs.readFileSync(quizPath, "utf-8"));

      await interaction.reply(
        `📘 **Weekly Quiz:**\n${quiz.question}\n` +
          `A. ${quiz.options[0]}\n` +
          `B. ${quiz.options[1]}\n` +
          `C. ${quiz.options[2]}\n` +
          `D. ${quiz.options[3]}\n\n` +
          `Use \`/answer <letter>\` to submit!`,
      );
    } catch (err) {
      console.error("❌ Error in /quiz command:", err);
      console.log("📖 Loaded quiz:", quiz);
      console.log("💡 /quiz command triggered");
      await interaction.reply({
        content:
          "❌ Couldn’t load the quiz. Ask a mod to save one from the editor.",
        ephemeral: true,
      });
    }
  },
};
