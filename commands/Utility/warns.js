const db = require('../../models/warns');

module.exports = {
    name: 'warns',
    aliases: ['warnings'],
    cooldown: 0,
    permissions: [],
    usage: ".warns (user)",
    description: "Lists a user's warn.",
    async execute(message, args, client, Discord) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!args[0]) user = message.guild.members.cache.get(message.author.id);
        if (!user) return message.channel.send("Couldn't find that user.");

        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided.';

        db.findOne({ guildId: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`${user.user.tag}'s warns`)
                    .setColor('YELLOW')
                    .setDescription(
                        data.content.map(
                            (w, i) =>
                                `\`${i + 1}\` | Moderator: ${message.guild.members.cache.get(w.moderator).user.tag}\nReason: ${w.reason}`
                        )
                    )
                )
            } else {
                message.channel.send('User has no warns.');
            }
        })
    }
}