require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'kick',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".kick {user} (reason)",
    description: "Kicks a user.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
        const memberKickCheck = await quickmongo.fetch(`memberKick-${message.guild.id}`);

        const staffRoleCheck = await quickmongo.fetch(`staffrole-${message.guild.id}`);
        const getStaffRole = await quickmongo.get(`staffrole-${message.guild.id}`);
        let staffRole;
        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        let modRole;

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            if (modRoleCheck || staffRoleCheck) {
                modRole = message.guild.roles.cache.get(getModRole);
                staffRole = message.guild.roles.cache.get(getStaffRole)
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

        if (!message.guild.me.hasPermission('Kick_MEMBERS')) return message.channel.send('I do not have **KICK MEMBERS** permissions.');
        if (!args[0]) return message.channel.send('Please specify a user.');
        if (!mentionedMember) return message.channel.send("Sorry, I can't find that user.");
        if (!mentionedMember.kickable) return message.channel.send('Sorry, I cannot kick that user.');

        try {
            await mentionedMember.send(
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`You have been kicked from ${message.guild.name}.\nReason: ${reason}`)
            )
        } catch {
            message.channel.send('I cannot inform this member of the kick. (DMs off)');
        }

        const letEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${mentionedMember} has been kicked.`)

        try {
            await mentionedMember.kick({
                reason: reason,
            }).then(() => message.channel.send(letEmbed));

            if (!memberKickCheck) return;
            if (logsChannelCheck) {
                if (!logsCheck) return;

                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                const banEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('MEMBER KICKED')
                    .setDescription(`${mentionedMember} has been kicked.\n\n**Moderator:** \n${message.author}\n\n**Reason:** \n${reason}`)
                    .setFooter(mentionedMember.id)
                    .setTimestamp()
                logsChannel.send(banEmbed);
            } else return;

        } catch {
            message.channel.send('I ran into an error banning that member.');
        }
    }
}