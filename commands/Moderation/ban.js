require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'ban',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".ban {user} (reason)",
    description: "Bans a user.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
        const memberBanCheck = await quickmongo.fetch(`memberBan-${message.guild.id}`);

        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        let modRole;

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            if (modRoleCheck) {
                modRole = message.guild.roles.cache.get(getModRole);
            } else return message.channel.send('Please set up **Mod Role** before using this command.\n**NOTE:** mods can kick, mute and ban members.');

            if (modRole) {
                if (!message.member.roles.cache.has(modRole.id)) return message.channel.send('You do not have permission to use this command.');
            }
        }

        let reason = args.slice(1).join(' ');
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!reason) reason = 'No Reason Provided';

        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('I do not have **BAN MEMBERS** permissions.');
        if (!args[0]) return message.channel.send('Please specify a user.');
        if (!mentionedMember) return message.channel.send("Sorry, I can't find that user.");
        if (!mentionedMember.bannable) return message.channel.send('Sorry, I cannot ban that user.');

        try {
            await mentionedMember.send(
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`You have been banned from ${message.guild.name}.\nReason: ${reason}`)
            )
        } catch {
            message.channel.send('I cannot inform this member of the ban. (DMs off)');
        }

        const letEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${mentionedMember} has been banned.`)

        await mentionedMember.ban({
            days: 7,
            reason: reason,
        }).then(() => message.channel.send(letEmbed));

        if (!memberBanCheck) return;
        if (logsChannelCheck) {
            if (!logsCheck) return;

            const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
            const logsChannel = message.guild.channels.cache.get(getLogsChannel);

            const banEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setThumbnail(mentionedMember.displayAvatarURL({ dynamic: true }))
                .setTitle('MEMBER BANNED')
                .setDescription(`${mentionedMember} has been banned.\n\n**Moderator:** \n${message.author}\n\n**Reason:** \n${reason}`)
                .setFooter(mentionedMember.id)
                .setTimestamp()
            logsChannel.send(banEmbed);
        } else return;

    }
}