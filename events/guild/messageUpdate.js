require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    const logsChannelCheck = await quickmongo.fetch(`logs-${oldMessage.guild.id}`);
    const logsCheck = await quickmongo.fetch(`logslogs-${oldMessage.guild.id}`);
    const messageEditCheck = await quickmongo.fetch(`messageEdit-${oldMessage.guild.id}`);

    if (!logsCheck) return;
    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${oldMessage.guild.id}`);
        const logsChannel = oldMessage.guild.channels.cache.get(getLogsChannel);

        if (messageEditCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('MESSAGE EDITED')
                .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`By: ${oldMessage.author}\nIn: ${oldMessage.channel}\n\n**Old Message:**\n${oldMessage.content}\n**New Message:**\n${newMessage.content}`)
                .setFooter(oldMessage.author.id)
                .setTimestamp()
            )
        }
    }
}