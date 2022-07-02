const moment = require('moment');

module.exports = {
    name: 'userinfo',
    aliases: ['info'],
    cooldown: 3,
    permissions: [],
    usage: ".userinfo (user)",
    description: "Gives a user's information",
    async execute(message, args, client, Discord) {
        let userArray = message.content.split(" ");
        let userArgs = userArray.slice(1);
        let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

        if (member.presence.status === 'dnd') member.presence.status = 'Do Not Disturb';
        if (member.presence.status === 'online') member.presence.status = 'Online';
        if (member.presence.status === 'idle') member.presence.status = 'Idle';
        if (member.presence.status === 'offline') member.presence.status = 'offline';

        let x = Date.now() - member.createdAt;
        let y = Date.now() - message.guild.members.cache.get(member.id).joinedAt;
        const joined = Math.floor(y / 86400000);

        const joineddate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
        let status = member.presence.status;

        const userEmbed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setTimestamp()
            .setColor('WHITE')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Nickname**: <@${member.id}>`)
            .addField("Member ID", member.id)
            .addField('Roles', `<@&${member._roles.join('> <@&')}>`)
            .addField("Account Created On:", ` ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY")}`, true)
            .addField('Joined Server On:', `${joineddate} \n> ${joined} Days Ago`)
            .addField("Status", status)
            .setFooter(`ID: ${member.user.id}`);

        if (message.guild.members.cache.get(member.user.id)) {
            message.channel.send(userEmbed);
        } else {
            return message.channel.send('User not in server');
        }

    }
}