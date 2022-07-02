require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'antilink-disable',
    aliases: ['aldisable'],
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: "antilink-disable",
    description: "Disables antilink.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const alCheck = await quickmongo.fetch(`allogs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);

        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send('I do not have the `Manage Messages` permission.');

        if (await quickmongo.fetch(`link-${message.guild.id}`) === true) {
            await quickmongo.delete(`link-${message.guild.id}`);
            message.channel.send('Antilink has been **DISABLED**.');
            if (logsChannelCheck) {
                if (!logsCheck) return;
                if (!alCheck) return;
                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                logsChannel.send(new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle('ANTILINK DISABLED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Moderator:**\n\n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                )
            }
        } else return message.channel.send('Antilink has **ALREADY BEEN DISABLED.**');
    }
}