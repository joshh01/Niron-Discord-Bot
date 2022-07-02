require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');

module.exports = {
    name: 'mute',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".mute {user} (reason)",
    description: "Mutes a member.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
        const muteCheck = await quickmongo.fetch(`mutelogs-${message.guild.id}`);

        const muteRoleCheck = await quickmongo.fetch(`muterole-${message.guild.id}`);
        const getMuteRole = await quickmongo.get(`muterole-${message.guild.id}`);
        let muteRole;


        const staffRoleCheck = await quickmongo.fetch(`staffrole-${message.guild.id}`);
        const getStaffRole = await quickmongo.get(`staffrole-${message.guild.id}`);
        let staffRole;
        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        let modRole;

        if (!message.member.hasPermission('MANAGE_ROLES')) {

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

        }

        let reason = args.slice(1).join(' ');
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!reason) reason = 'No Reason Provided';

        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('I do not have **MANAGE ROLES** permissions.');

        if (!args[0]) return message.channel.send('Please specify a valid user or user ID.');
        if (!mentionedMember) return message.channel.send('I cannot find this user');

        if (muteRoleCheck) {
            muteRole = message.guild.roles.cache.get(getMuteRole);
        } else return message.channel.send('Please set up **Mute Role** before using this command.');

        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot mute yourself.');
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot mute me.');
        if (mentionedMember.roles.cache.has(muteRole.id)) return message.channel.send('This user is already muted.');
        if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) {
            return message.channel.send('You can only mute people with a lower role than you.');
        }

        const serverMuteEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`You have been muted in ${message.guild.name}.\n**Reason:** ${reason}`)

        const dmMuteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${mentionedMember} has been muted for ${reason}`)

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

                const muteEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('MEMBER MUTED')
                    .setDescription(`${mentionedMember} has been muted.\n\n**Moderator:** \n${message.author}\n\n**Reason:** ${reason}`)
                    .setFooter(mentionedMember.id)
                    .setTimestamp()
                logsChannel.send(muteEmbed);
            } else return;

        } catch (err) {
            message.channel.send('There was an error in giving the muted role.');
        }
    }
}
