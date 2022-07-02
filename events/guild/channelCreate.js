require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, channel) => {

    const logsChannelCheck = await quickmongo.fetch(`logs-${channel.guild.id}`);
    const logsCheck = await quickmongo.fetch(`logslogs-${channel.guild.id}`);
    const channelCreateCheck = await quickmongo.fetch(`channelcreate-${channel.guild.id}`);

    if (!logsCheck) return;
    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${channel.guild.id}`);
        const logsChannel = channel.guild.channels.cache.get(getLogsChannel);

        if (channelCreateCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('CHANNEL CREATED')
                .setDescription(`Name: ${channel.name}\nID: ${channel.id}\nType: ${channel.type}`)
                .setTimestamp()
            )
        }
    }
}