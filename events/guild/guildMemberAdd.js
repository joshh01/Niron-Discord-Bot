//const canvacord = require('canvacord');
const moment = require('moment');
const ms = require('ms');
require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');

module.exports = async (Discord, client, member) => {
    const autoroleCheck = await quickmongo.fetch(`autorole-${member.guild.id}`);
    const memberJoinCheck = await quickmongo.fetch(`memberJoin-${member.guild.id}`);
    const getMemberRole = await quickmongo.get(`memberrole-${member.guild.id}`);
    const getMuteRole = await quickmongo.get(`muterole-${member.guild.id}`);
    const memberRole = member.guild.roles.cache.get(getMemberRole);
    const muteRole = member.guild.roles.cache.get(getMuteRole);

    const logsCheck = await quickmongo.fetch(`logslogs-${member.guild.id}`);

    const welcomeChannelCheck = await quickmongo.fetch(`welcome-${member.guild.id}`);

    const logsChannelCheck = await quickmongo.fetch(`logs-${member.guild.id}`);
    const altKickCheck = await quickmongo.fetch(`altKick-${member.guild.id}`);
    const altKickLogsCheck = await quickmongo.fetch(`altKickLogs-${member.guild.id}`);

    if (autoroleCheck) {
        const muteSchemaData = await muteSchema.findOne({ Guild: member.guild.id });
        if (!muteSchema) return;

        const user = muteSchemaData.Users.findIndex(props => props === member.id);
        if (user == -1) {
            member.roles.add(memberRole);
        } else {
            member.roles.add(muteRole);
            member.roles.add(memberRole);
        }
    }

    let welcomer = new canvacord.Welcomer()
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

        if (memberJoinCheck) {

            //ALT CHECK

            const timeSpan = ms('30 Days');
            const createdAt = new Date(member.user.createdAt).getTime();
            const difference = Date.now() - createdAt;

            let altwarn;
            if (difference < timeSpan) {
                logsChannel.send(new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('MEMBER JOINED')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${member.user}\n**Account Age:**\n${new Date(member.user.createdAt)}\n⚠️ FLAG: Possible alt.`)
                    .setFooter(`${member.user.id}`)
                    .setTimestamp()
                )

                if (altKickCheck) {
                    member.kick()
                }

                if (altKickLogsCheck) {
                    logsChannel.send(new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('MEMBER KICKED')
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${member.user}\n**Reason:**\nALT DETECTED`)
                        .setFooter(`${member.user.id}`)
                        .setTimestamp()
                    )
                }

            } else {
                logsChannel.send(new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('MEMBER JOINED')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${member.user}
                    ${member.user.username}#${member.user.discriminator}\n\n**Account Made:**\n${moment(member.user.createdAt)}`)
                    .setFooter(`${member.user.id}`)
                    .setTimestamp()
                )
            }
        }
    }

    if (welcomeChannelCheck) {

        const getWelcomeChannel = await quickmongo.get(`welcome-${member.guild.id}`);
        const welcomeChannel = member.guild.channels.cache.get(getWelcomeChannel);

        welcomer.build().then(data => {
            const attachment = new Discord.MessageAttachment(data, 'welcomer.png');
            welcomeChannel.send(`${member.user}, welcome to ${member.guild.name}`, attachment);
        })
    } else return;
}