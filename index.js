const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const voiceChannelId = '1408547869723721758';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    updateMemberCount();
    setInterval(updateMemberCount, 60000); // تحديث كل دقيقة
});

async function updateMemberCount() {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    await guild.members.fetch(); // جلب كل الأعضاء

    // عد الأعضاء الحقيقيين فقط (بدون البوتات)
    const humanCount = guild.members.cache.filter(member => !member.user.bot).size;

    const channel = guild.channels.cache.get(voiceChannelId);
    if (!channel) return;

    try {
        await channel.setName(`Member: ${humanCount}`);
        console.log(`Updated voice channel name to: Member: ${humanCount}`);
    } catch (error) {
        console.error('Failed to update voice channel name:', error);
    }
}

client.login(process.env.DISCORD_TOKEN);