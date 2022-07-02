require('dotenv').config();
const ms = require('ms');
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');

module.exports = {
    name: 'tempmute',
    aliases: ['tmute'],
    cooldown: 0,
    permissions: [],
    usage: ".tempmute {user} {time} (reason)",
    description: "Temporarily mutes a member.",
    async execute(message, args, client, Discord) {
        let time = args[1];
        let reason = args.slice(2).join(' ');
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
        const muteCheck = await quickmongo.fetch(`mutelogs-${message.guild.id}`);

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const muteRoleCheck = await quickmongo.fetch(`muterole-${message.guild.id}`);
        const getMuteRole = await quickmongo.get(`muterole-${message.guild.id}`);
        let muteRole;

        const staffRoleCheck = await quickmongo.fetch(`staffrole-${message.guild.id}`);
        const getStaffRole = await quickmongo.get(`staffrole-${message.guild.id}`);
        let staffRole;
        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        let modRole;

        if (modRoleCheck || staffRoleCheck) {
            modRole = message.guild.roles.cache.get(getModRole);
            staffRole = message.guild.roles.cache.get(getStaffRole);
        } else return message.channel.send('Please set up **Mod / Staff Roles** before using this command.\n**NOTE:** staff can only mute and kick members, where mods can kick, mute and ban mmebers.');

        if (!modRole) {
            if (!message.member.roles.cache.has(staffRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        if (!staffRole) {
            if (!message.member.roles.cache.has(modRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        if (modRole && staffRole) {
            if (!message.member.roles.cache.has(modRole.id) && !message.member.roles.cache.has(staffRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        if (!reason) reason = 'No Reason Provided';

        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I do not have **MANAGE ROLES** permissions.');

        if (!args[0]) return message.channel.send('Please specify a valid user or user ID.');
        if (!mentionedMember) return message.channel.send('I cannot find this user');

        if (muteRoleCheck) {
            muteRole = message.guild.roles.cache.get(getMuteRole);
        } else return message.channel.send('Please set up **Mute Role** before using this command.');

        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot mute yourself.');
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot mute me.');
        if (mentionedMember.roles.cache.has(muteRole.id)) return message.channel.send('This user is already tempmuted.');
        if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) {
            return message.channel.send('You can only mute people with a lower role than you.');
        }

        const serverMuteEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`You have been muted in ${message.guild.name}.\n**Reason:** ${reason}.\n**Length:** ${time}`)

        const dmMuteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${mentionedMember} has been muted for ${reason} for ${time}`)

        const serverunMuteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`You have been unmuted in ${message.guild.name}.`)

        try {
            await mentionedMember.roles.add(muteRole);
            muteSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
                if (!data) {
                    new muteSchema({
                        Guild: message.guild.id,
                        Users: mentionedMember.id,
                    }).save();
                } else {
                    data.Users.push(mentionedMember.id);
                    data.save();
                }
            })
            mentionedMember.send(serverMuteEmbed);
            message.channel.send(dmMuteEmbed);

            if (logsChannelCheck) {

                if (!logsCheck) return;
                if (!muteCheck) return;

                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                const muteLogEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('MEMBER MUTED')
                    .setDescription(`${mentionedMember} has been muted.\n\n**Moderator:** \n${message.author}\n\n**Reason:** ${reason}`)
                    .setFooter(mentionedMember.id)
                    .setTimestamp()
                logsChannel.send(muteLogEmbed);
            }

            setTimeout(async function () {
                muteSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
                    const user = data.Users.findIndex(props => props === mentionedMember.id);
                    if (user == -1) return message.channel.send('This user is not muted.');
                    data.Users.splice(user, 1);
                    data.save();
                    let reason = 'Mute Expired.';
                    const unmuteEmbed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`${mentionedMember} has been unmuted for ${reason}`)

                    await mentionedMember.roles.remove(muteRole);
                    mentionedMember.send(serverunMuteEmbed);
                    message.channel.send(unmuteEmbed);

                    if (logsChannelCheck) {
                        if (!logsCheck) return;
                        if (!muteCheck) return;

                        const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                        const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                        const unmuteLogEmbed = new Discord.MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                            .setTitle('MEMBER UNMUTED')
                            .setDescription(`${mentionedMember} has been unmuted.\n\n**Moderator:** \n${message.author}\n\n**Reason:** ${reason}`)
                            .setFooter(mentionedMember.id)
                            .setTimestamp()
                        logsChannel.send(unmuteLogEmbed);
                    }
                })
            }, ms(time));
        } catch (err) {
            message.channel.send('There was an error in giving the muted role.');
        }
    }
}
