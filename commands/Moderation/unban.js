require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'unban',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".unban {user} (reason)",
    description: "Unbans a user.",
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
        if (!args[0]) return message.channel.send('Please specify a user ID.');
        if (isNaN(args[0])) return message.channel.send('Please specify a valid user ID.');

        message.guild.fetchBans().then(async (bans) => {
            if (bans.size == 0) return message.channel.send('This server does not have any banned members.');
            let banneduser = bans.find(b => b.user.id == userID);

            if (!banneduser) return message.channel.send('The user ID stated is not currently banned.');

            await message.guild.members.unban(banneduser.user, reason).catch((err) => {
                console.log(err);
                message.channel.send('I cannot unban this user.');
            }).then(async () => {
                message.channel.send('User bas been unbanned.');

                if (logsChannelCheck) {
                    if (!logsCheck) return;

                    const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                    const logsChannel = message.guild.channels.cache.get(getLogsChannel);
                    const member = client.users.cache.get(userID);

                    const unbanEmbed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                        .setTitle('MEMBER UNBANNED')
                        .setDescription(`<@${userID}> has been unbanned.\n\n**Moderator:** \n${message.author}\n\n**Reason:** \n${reason}`)
                        .setFooter(userID)
                        .setTimestamp()
                    logsChannel.send(unbanEmbed);
                } else return;
            });
        })
    }
}