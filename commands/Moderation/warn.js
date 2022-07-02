const db = require('../../models/warns');
require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'warn',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".warn {user} (reason)",
    description: "Warns a user.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const warnCheck = await quickmongo.fetch(`warnlogs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);

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

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send('User not found.');

        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided.';

        db.findOne({ guildId: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    guildId: message.guild.id,
                    user: user.user.id,
                    content: {
                        moderator: message.author.id,
                        reason: reason
                    }
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason: reason
                }
                data.content.push(obj);
            }
            data.save();
        })
        user.send(new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`You have been warned in ${message.guild}\nReason: ${reason}`)
        )
        message.channel.send(new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Warned ${user} for ${reason}`)
        )

        if (logsChannelCheck) {
            if (!logsCheck) return;
            if (!warnCheck) return;
            const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
            const logsChannel = message.guild.channels.cache.get(getLogsChannel);

            logsChannel.send(new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setTitle('USER WARNED')
                .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**User:**\n${user}\n\n**Moderator:**\n${message.author}\n\n**Reason:**\n${reason}`)
                .setFooter(user.user.id)
                .setTimestamp()
            )
        }
    }
}