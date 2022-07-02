const moment = require('moment');

module.exports = {
    name: 'serverinfo',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".serverinfo",
    description: "Provides information about the server.",
    async execute(message, args, client, Discord) {
        const guild = message.guild;
        const owner = message.guild.members.cache.get(guild.ownerID);
        const embed = new Discord.MessageEmbed()
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL())
            .setColor('RANDOM')
            .addField('General Info', [
                `ID: ${guild.id}`,
                `Name: ${guild.name}`,
                `Owner: ${message.guild.members.cache.get(guild.ownerID)}`
            ])
            .addField('Counts', [
                `Member Count: ${guild.memberCount} members`,
                `Role Count: ${guild.roles.cache.size} roles`,
                `Channels: ${guild.channels.cache.filter(ch => ch.type === 'text' || ch.type === 'voice').size} total (Text: ${guild.channels.cache.filter(ch => ch.type === 'text').size}, Voice: ${guild.channels.cache.filter(ch => ch.type === 'voice').size})`,
                `Emojis: ${guild.emojis.cache.size} (Regular: ${guild.emojis.cache.filter(e => !e.animated).size}, Animated: ${guild.emojis.cache.filter(e => e.animated).size})`
            ])
            .addField('Additional Information', [
                `Created: ${moment(guild.createdTimestamp).format('LT')} ${moment(guild.createdTimestamp).format('LL')} ${moment(guild.createdTimestamp).fromNow()}`,
                `Region: ${guild.region}`,
                `Boost Tier: ${guild.premiumTier ? `Tier ${guild.premiumTier}` : 'None'}`,
                `Boost Count: ${guild.premiumSubscriptionCount || '0'}`,
            ]);

        message.channel.send(embed);
    }
}