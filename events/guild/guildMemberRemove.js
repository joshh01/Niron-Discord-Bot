//const canvacord = require('canvacord');
require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, member) => {

    const leaveChannelCheck = await quickmongo.fetch(`leave-${member.guild.id}`);
    const memberLeaveCheck = await quickmongo.fetch(`memberLeave-${member.guild.id}`);
    const logsChannelCheck = await quickmongo.fetch(`logs-${member.guild.id}`);

    const logsCheck = await quickmongo.fetch(`logslogs-${member.guild.id}`);

    let leaver = new canvacord.Leaver()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setMemberCount(member.guild.memberCount)
        .setGuildName('OUR SERVER!')
        .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
        .setBackground('https://cdn.discordapp.com/attachments/860586184325857280/878455371700772914/red-space-10.png')
        .setColor('title', '#FFFFFF')
        .setColor('title-border', 'BLACK')
        .setColor('avatar', '#FFFFFF')
        .setColor('username', '#FFFFFF')
        .setColor('username-box', 'BLACK')
        .setColor('hashtag', '#FFFFFF')
        .setColor('discriminator', '#FFFFFF')
        .setColor('discriminator-box', 'BLACK')
        .setColor('message', '#FFFFFF')
        .setColor('message-box', 'BLACK')
        .setColor('member-count', '#FFFFFF')
        .setColor('background', '#FFFFFF')
        .setColor('border', 'BLACK');

    if (logsChannelCheck) {

        if (!logsCheck) return;

        const getLogsChannel = await quickmongo.get(`logs-${member.guild.id}`);
        const logsChannel = member.guild.channels.cache.get(getLogsChannel);

        if (memberLeaveCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('MEMBER LEFT')
                .setDescription(`${member.user.username}#${member.user.discriminator}
                ${member.user} has left the server.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`${member.user.id}`)
                .setTimestamp()
            )
        }
    }

    if (leaveChannelCheck) {
        const getLeaveChannel = await quickmongo.get(`leave-${member.guild.id}`);
        const leaveChannel = member.guild.channels.cache.get(getLeaveChannel);

        leaver.build().then(data => {
            const attachment = new Discord.MessageAttachment(data, 'leaver.png');
            leaveChannel.send(attachment);
        })
    } else return;
}