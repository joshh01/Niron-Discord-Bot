const db = require('../../models/warns');
require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'clearwarns',
    aliases: ['cw'],
    cooldown: 0,
    permissions: ['MANAGE_ROLES'],
    usage: ".clearwarns {user}",
    description: "Revokes all of a user's warns.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const warnCheck = await quickmongo.fetch(`warnlogs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);

        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        let modRole;

        if (modRoleCheck) {
            modRole = message.guild.roles.cache.get(getModRole);
        } else return message.channel.send('Please set up **Mod Role** before using this command.\n**NOTE:** mods can kick, mute and ban mmebers.');

        if (modRole) {
            if (!message.member.roles.cache.has(modRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send('User not found.');

        db.findOne({ guildId: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await db.findOneAndDelete({ user: user.user.id, guildId: message.guild.id });
                message.channel.send(`Cleared ${user.user.tag}'s warns.`);

                if (logsChannelCheck) {
                    if (!logsCheck) return;
                    if (!warnCheck) return;
                    const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                    const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                    logsChannel.send(new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle('WARNS CLEARED')
                        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`**User:**\n${user}\n\n**Moderator:**\n${message.author}`)
                        .setFooter(user.user.id)
                        .setTimestamp()
                    )
                }
            } else {
                message.channel.send('This user does not have any warns.');
            }
        })
    }
}