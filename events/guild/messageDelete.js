require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, message) => {

    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })

    if (message.author.bot) return;
    const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
    const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
    const messageDeleteCheck = await quickmongo.fetch(`messageDelete-${message.guild.id}`);

    if (!logsCheck) return;
    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
        const logsChannel = message.guild.channels.cache.get(getLogsChannel);

        if (messageDeleteCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('MESSAGE DELETED')
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`By: ${message.author}\nIn: ${message.channel}\n\n**Message Content:**\n${message.content}`)
                .setFooter(message.guild.ownerID)
                .setTimestamp()
            )
        }
    }
}