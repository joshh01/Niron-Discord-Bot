const db = require('../../models/warns');
require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'removewarn',
    aliases: ['rw'],
    cooldown: 0,
    permissions: [],
    usage: ".removewarn {user} {warn #}",
    description: "Revokes a user's warn.",
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
                let number = parseInt(args[1]) - 1;
                data.content.splice(number, 1);
                data.save();
                message.channel.send('Successfully deleted the warn.');

                if (logsChannelCheck) {
                    if (!logsCheck) return;
                    if (!warnCheck) return;
                    const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                    const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                    logsChannel.send(new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle('WARN REMOVED')
                        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`**User:**\n${user}\n\n**Moderator:**\n${message.author}\n\n**Warn Number:**\n\`${number}\``)
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