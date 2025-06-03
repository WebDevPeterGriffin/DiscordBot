const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("Post this week’s quiz"),
  async execute(interaction) {
    const allowedRoleIds = ["1353401702522421358", "1353401445755654244"];
    const serverOwnerId = interaction.guild.ownerId;

    const member = await interaction.guild.members.fetch(interaction.user.id);

    const hasAccess =
      interaction.user.id === serverOwnerId ||
      member.roles.cache.some((role) => allowedRoleIds.includes(role.id));

    if (!hasAccess) {
      return interaction.reply({
        content: "🚫 Only Moderators and Admins can use this command.",
        flags: 1 << 6, // ✅ Replaces deprecated "ephemeral: true"
      });
    }

    await interaction.reply(
      "📘 **Weekly Quiz:**\nWhat does `useEffect` do?\nA. Renders CSS\nB. Handles state\nC. Performs side effects\nD. Creates components\n\nUse `/answer <letter>` to submit!",
    );
  },
};
