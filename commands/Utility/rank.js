const Levels = require('discord-xp');
//const canvacord = require('canvacord');

module.exports = {
    name: 'rank',
    aliases: ['level', 'rank'],
    cooldown: 0,
    permissions: [],
    usage: ".rank (user)",
    description: "Displays a user's level.",
    async execute(message, args, client, Discord) {
        const target = message.mentions.users.first() || message.author;
        const user = await Levels.fetch(target.id, message.guild.id);

        const neededXp = Levels.xpFor(parseInt(user.level) + 1);
        const userRank = await Levels.fetch(target.id, message.guild.id, true);

        if (!user) return message.reply('you do not have any xp. Try sending some messages.');

        const rank = new canvacord.Rank()
            .setAvatar(message.author.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setRank(userRank.position)
            .setLevel(user.level)
            .setRequiredXP(neededXp)
            .setStatus(message.member.presence.status)
            .setProgressBar('#FFA500', 'COLOR')
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator)
        rank.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, 'rank.png');
                message.channel.send(attachment);
            })
    }
}