require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'antilink-enable',
    aliases: ['alenable'],
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: ".antilink-enable",
    description: "Enables antilink.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const alCheck = await quickmongo.fetch(`allogs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);

        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send('I do not have the `Manage Messages` permission.');

        if (await quickmongo.fetch(`link-${message.guild.id}`) === null) {
            await quickmongo.set(`link-${message.guild.id}`, true);
            message.channel.send('Antilink has been **ENABLED.**');
            if (logsChannelCheck) {
                if (!logsCheck) return;
                if (!alCheck) return;
                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                logsChannel.send(new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle('ANTILINK ENABLED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Moderator:**\n\n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                )
            }
        } else if (await quickmongo.fetch(`link-${message.guild.id}`) === false) {
            await quickmongo.set(`link-${message.guild.id}`, true);
            message.channel.send('Antilink has been **ENABLED.**');
            if (logsChannelCheck) {
                if (!logsCheck) return;
                if (!alCheck) return;
                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                logsChannel.send(new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle('ANTILINK ENABLED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Moderator:**\n\n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                )
            }
        } else return message.channel.send('Antilink has **ALREADY BEEN ENABLED.**');
    }
}