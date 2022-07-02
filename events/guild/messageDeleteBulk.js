require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, messages) => {

    const logsChannelCheck = await quickmongo.fetch(`logs-${messages.first().guild.id}`);
    const messagePurgeCheck = await quickmongo.fetch(`messagePurge-${messages.first().guild.id}`);

    const length = new Array(messages).length;
    const channel = messages.first().channel;

    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${messages.first().guild.id}`);
        const logsChannel = messages.first().guild.channels.cache.get(getLogsChannel);

        if (messagePurgeCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('MESSAGES BULK DELETED')
                .setDescription(`\`${length}\` messages have been deleted in ${channel}.`)
                .setTimestamp()
            )
        }
    }

}