require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'shadowban',
    aliases: ['preban'],
    cooldown: 0,
    permissions: [],
    usage: ".shadowban {user} (reason)",
    description: 'Shadow bans a user.',
    async execute(message, args, client, Discord) {
        let reason = args.slice(1).join(' ');
        const userID = args[0];

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
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

        if (!reason) reason = 'No Reason Provided';

        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('I do not have **BAN MEMBERS** permissions.');
        if (isNaN(userID)) return message.channel.send('Please specify a user ID.');
        if (userID === message.author.id) return message.channel.send('You cannot ban yourself.');
        if (userID === client.user.id) return message.channel.send('You cannot ban me.');

        client.users.fetch(userID).then(async user => {
            await message.guild.members.ban(user.id, { reason: reason });
            message.channel.send('User has been banned.').catch((err) => {
                console.log(err)
            })

            if (logsChannelCheck) {
                if (!logsCheck) return;

                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                const banEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('MEMBER BANNED')
                    .setDescription(`<@${userID}> has been banned.\n\n**Moderator:** \n${message.author}\n\n**Reason:** \n${reason}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                logsChannel.send(banEmbed);
            } else return;
        })
    }
}