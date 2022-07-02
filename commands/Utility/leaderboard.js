const Levels = require('discord-xp');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    cooldown: 3,
    permissions: [],
    usage: ".leaderboard",
    description: "Displays the server's level leaderboard.",
    async execute(message, args, client, Discord) {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 5);
        if (rawLeaderboard.length < 1) return message.reply('Nobody is on the leaderboard yet.');

        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard);

        const lb = leaderboard.map(e => `${e.position}, ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);
        //message.channel.send(`${lb.join('\n\n')}`);
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle(`${message.guild.name}'s Leaderboard`)
                .setDescription(lb.join('\n\n'))
        );
    }
}