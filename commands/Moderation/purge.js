require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'purge',
    aliases: ['clear'],
    cooldown: 1,
    permissions: ['MANAGE_MESSAGES'],
    usage: ".purge {# messages}",
    description: 'This command bulk deletes messages.',
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const messagePurgeCheck = await quickmongo.fetch(`messagePurge-${message.guild.id}`);
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

        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Invalid command attempt. Usage:**\n**.purge [amount of messages]**\n\namount of messages: any integer from 1 to 100');

        if (!args[0]) return message.channel.send(errorEmbed);
        if (isNaN(args[0])) return message.channel.send(errorEmbed);
        if (args[0] > 100) return message.channel.send(errorEmbed);
        if (args[0] < 1) return message.channel.send(errorEmbed);

        await message.channel.messages.fetch({ limit: args[0] }).then(async messages => {
            message.channel.bulkDelete(messages);

            if (logsChannelCheck) {
                if (!logsCheck) return;

                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                const purgeEmbed = new Discord.MessageEmbed()
                    .setColor('WHITE')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('MESSAGES PURGED')
                    .setDescription(`\`${args[0]}\` messages have been purged in ${message.channel}.\n\n**Moderator:** \n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()

                if (messagePurgeCheck) {
                    logsChannel.send(purgeEmbed);
                }
            } else return;
        })
    }
}