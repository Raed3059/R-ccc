const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// أمر /menu
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "menu1") {
    const embed = new EmbedBuilder()
      .setTitle("🎶 لوحة تحكم")
      .setDescription("اختبر الأزرار")
      .setColor("Blue");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("join").setLabel("🚪 دخول").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("leave").setLabel("❌ خروج").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("pause").setLabel("⏹️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("resume").setLabel("▶️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("skip").setLabel("⏭️").setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
});

// الأزرار
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  await interaction.reply({ content: `🔘 ضغطت الزر: ${interaction.customId}`, ephemeral: true });
});

// تسجيل الأوامر
const commands = [
  new SlashCommandBuilder().setName("menu").setDescription("📌 يرسل لوحة أزرار")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Slash command registered.");
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.DISCORD_TOKEN);