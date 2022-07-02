module.exports = {
    name: 'avatar',
    aliases: ['av'],
    cooldown: 5,
    permissions: [],
    usage: ".avatar (user)",
    description: "Provides a user's avatar.",
    execute(message, args, client, Discord) {
        let userArray = message.content.split(" ");
        let userArgs = userArray.slice(1);
        let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]);

        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('❌ **Cannot find that user.**')

        if (args[0]) {
            if (!member) {
                return message.channel.send(errorEmbed);
            }
        }
        if (!args[0]) member = message.member;
        const userAvatar = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setFooter(`${member.user.tag}'s avatar`)
            .setImage(member.user.displayAvatarURL({ dynamic: true }))

        message.channel.send(userAvatar);
    }
}