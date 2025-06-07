const { SlashCommandBuilder, ChannelType } = require("discord.js");
const fs = require("fs");
const path = require("path");

const QUIZ_META_PATH = path.join(__dirname, "../quizMeta.json");
const QUIZ_PATH = path.join(__dirname, "../quizzes.json");

// The channel where the quiz should be posted
const QUIZ_CHANNEL_ID = "1353403383553458286"; // Replace with your #general channel ID

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("Post the current quiz"),

  async execute(interaction) {
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
      const quiz = JSON.parse(fs.readFileSync(QUIZ_PATH, "utf-8"));
      const meta = fs.existsSync(QUIZ_META_PATH)
        ? JSON.parse(fs.readFileSync(QUIZ_META_PATH, "utf-8"))
        : {};

      const channel = await interaction.guild.channels.fetch(QUIZ_CHANNEL_ID);
      if (!channel || channel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Quiz channel not found or is not a text channel.",
          ephemeral: true,
        });
      }

      // Unpin previous quiz message if exists
      if (meta.lastMessageId) {
        try {
          const oldMsg = await channel.messages.fetch(meta.lastMessageId);
          if (oldMsg) await oldMsg.unpin();
        } catch (err) {
          console.warn("⚠️ Couldn’t unpin previous message:", err.message);
        }
      }

      // Post and pin the new quiz
      const optionLabels = ["A", "B", "C", "D", "E"];
      const formattedOptions = quiz.options
        .map((opt, i) => `${optionLabels[i]}. ${opt}`)
        .join("\n");

      await interaction.reply(
        `📘 **Weekly Quiz:**\n${quiz.question}\n${formattedOptions}\n\nUse \`/answer <letter>\` to submit!`,
      );

      await newMsg.pin();

      // Save new message ID
      fs.writeFileSync(
        QUIZ_META_PATH,
        JSON.stringify({ lastMessageId: newMsg.id }, null, 2),
      );

      await interaction.reply({
        content: "✅ Quiz posted and pinned in #general!",
        ephemeral: true,
      });
    } catch (err) {
      console.error("❌ Error in /quiz:", err);
      await interaction.reply({
        content: "❌ Failed to post the quiz.",
        ephemeral: true,
      });
    }
  },
};
