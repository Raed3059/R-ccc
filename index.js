const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ID الروم الصوتي
const voiceChannelId = '1408547869723721758';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // تحديث الاسم أول مرة عند تشغيل البوت
    updateMemberCount();

    // كل دقيقة يحدث الاسم تلقائي
    setInterval(updateMemberCount, 60000);
});

async function updateMemberCount() {
    const guild = client.guilds.cache.first(); // إذا عندك سيرفر واحد
    if (!guild) return;

    await guild.members.fetch(); // تأكد من جلب كل الأعضاء

    const memberCount = guild.memberCount;

    const channel = guild.channels.cache.get(voiceChannelId);
    if (!channel) return;

    try {
        await channel.setName(`Member: ${memberCount}`);
        console.log(`Updated voice channel name to: Member: ${memberCount}`);
    } catch (error) {
        console.error('Failed to update voice channel name:', error);
    }
}

client.login(process.env.DISCORD_TOKEN);