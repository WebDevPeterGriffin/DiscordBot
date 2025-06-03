require("dotenv").config();
require("./server");
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Register slash commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log("🔄 Registering commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        "1378877824395382926", // ✅ Application (Client) ID — goes first
        "1353396837150752960",
      ),
      { body: commands },
    );
    console.log("✅ Commands registered.");
  } catch (err) {
    console.error(err);
  }
})();

client.once("ready", () => {
  console.log(`🟢 Bot logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
