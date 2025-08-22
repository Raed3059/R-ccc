const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()],
  emitNewSongOnly: true
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// أمر setmenu1
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'setmenu1') {
    const embed = new EmbedBuilder()
      .setTitle("🎶 لوحة التحكم")
      .setDescription("تحكم في البوت من هنا")
      .setColor("Blue")
      .setFooter({ text: "مطور البوت: رائد المطيري" });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("join").setLabel("🚪 دخول الروم").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("leave").setLabel("❌ خروج").setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("vol_down").setLabel("🔉").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("pause").setLabel("⏹️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("resume").setLabel("▶️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("skip").setLabel("⏭️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("vol_up").setLabel("🔊").setStyle(ButtonStyle.Secondary)
    );

    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("👑 مطور البوت").setStyle(ButtonStyle.Link).setURL("https://discord.com/users/1079022798523093032")
    );

    await interaction.reply({ embeds: [embed], components: [row1, row2, row3] });
  }
});

// الأزرار
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const vc = interaction.member.voice.channel;
  if (!vc && interaction.customId !== "leave") {
    return interaction.reply({ content: "⚠️ ادخل روم صوتي أول.", ephemeral: true });
  }

  switch (interaction.customId) {
    case "join":
      await interaction.reply("✅ البوت دخل الروم.");
      break;
    case "leave":
      distube.voices.leave(interaction.guild);
      await interaction.reply("👋 تم إخراج البوت من الروم.");
      break;
    case "vol_down":
      distube.setVolume(vc, 50);
      await interaction.reply("🔉 تم خفض الصوت.");
      break;
    case "vol_up":
      distube.setVolume(vc, 100);
      await interaction.reply("🔊 تم رفع الصوت.");
      break;
    case "pause":
      distube.pause(vc);
      await interaction.reply("⏹️ تم إيقاف الأغنية مؤقتاً.");
      break;
    case "resume":
      distube.resume(vc);
      await interaction.reply("▶️ تم تشغيل الأغنية.");
      break;
    case "skip":
      distube.skip(vc);
      await interaction.reply("⏭️ تم تخطي الأغنية.");
      break;
  }
});

// تسجيل الأوامر
const commands = [
  new SlashCommandBuilder().setName("setmenu1").setDescription("📌 إرسال لوحة التحكم")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Slash commands registered.");
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.DISCORD_TOKEN);