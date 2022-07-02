require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'anticurse-disable',
    aliases: ['acdisable', 'antiswear-disable'],
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: ".anticurse-disable",
    description: "Disables anticurse.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const acCheck = await quickmongo.fetch(`aclogs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);

        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send('I do not have the `Manage Messages` permission.');

        if (await quickmongo.fetch(`swear-${message.guild.id}`) === true) {
            await quickmongo.delete(`swear-${message.guild.id}`);
            message.channel.send('Anticurse has been **DISABLED**.');
            if (logsChannelCheck) {
                if (!logsCheck) return;
                if (!acCheck) return;
                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                logsChannel.send(new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle('ANTICURSE DISABLED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Moderator:**\n\n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                )
            }
        } else return message.channel.send('Anticurse has **ALREADY BEEN DISABLED.**');
    }
}