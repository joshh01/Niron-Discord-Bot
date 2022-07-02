require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, channel) => {

    const logsChannelCheck = await quickmongo.fetch(`logs-${channel.guild.id}`);
    const logsCheck = await quickmongo.fetch(`logslogs-${channel.guild.id}`);
    const channelDeleteCheck = await quickmongo.fetch(`channeldelete-${channel.guild.id}`);

    if (!logsCheck) return;
    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${channel.guild.id}`);
        const logsChannel = channel.guild.channels.cache.get(getLogsChannel);

        if (channelDeleteCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('CHANNEL DELETED')
                .setDescription(`Name: ${channel.name}\nType: ${channel.type}`)
                .setTimestamp()
            )
        }
    }
}