require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');

module.exports = {
    name: 'unmute',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".unmute {user} (reason)",
    description: "Unmutes a member.",
    async execute(message, args, client, Discord) {
        let reason = args.slice(1).join(' ');
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);

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

        if (muteRoleCheck) {
            muteRole = message.guild.roles.cache.get(getMuteRole);
        } else return message.channel.send('Please set up **Mute Role** before using this command.');

        if (!reason) reason = 'No Reason Provided';

        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I do not have **MANAGE ROLES** permissions.');

        if (!args[0]) return message.channel.send('Please specify a valid user or user ID.');
        if (!mentionedMember) return message.channel.send('I cannot find this user');

        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot unmute yourself.');
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot unmute me.');
        if (!mentionedMember.roles.cache.has(muteRole.id)) return message.channel.send('This user is not muted.');
        if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) {
            return message.channel.send('You can only unmute people with a lower role than you.');
        }

        const serverUnmuteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`You have been unmuted in ${message.guild.name}.`)

        const dmUnmuteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${mentionedMember} has been unmuted. Reason: ${reason}`)

        try {
            await mentionedMember.roles.remove(muteRole);
            muteSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
                if (!data) return message.channel.send('This user is not muted.');

                const user = data.Users.findIndex(props => props === mentionedMember.id);
                if (user == -1) return message.channel.send('This user is not muted.');
                data.Users.splice(user, 1);
                data.save();

                mentionedMember.send(serverUnmuteEmbed);
                message.channel.send(dmUnmuteEmbed);

                if (logsChannelCheck) {

                    if (!logsCheck) return;

                    const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                    const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                    const unmuteEmbed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setTitle('MEMBER UNMUTED')
                        .setDescription(`${mentionedMember} has been unmuted.\n\n**Moderator:** \n${message.author}\n\n**Reason:** ${reason}`)
                        .setFooter(mentionedMember.id)
                        .setTimestamp()
                    logsChannel.send(unmuteEmbed);
                } else return;
            })
        } catch (err) {
            message.channel.send('There was an error in removing the muted role.');
        }
    }
}
