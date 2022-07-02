const prefixModel = require('../../models/prefix');
require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'prefix',
    aliases: ['prefixset', 'setprefix'],
    cooldown: 2,
    permissions: ['ADMINISTRATOR'],
    usage: ".prefix {new-prefix}",
    description: "Sets the server's prefix.",
    async execute(message, args, client, Discord) {

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
        const prefixChangeCheck = await quickmongo.fetch(`prefixChange-${message.guild.id}`);

        const data = await prefixModel.findOne({
            GuildID: message.guild.id
        })

        if (!args[0]) return message.channel.send('Please provide a **new prefix.**');
        if (args[0].length > 5) return message.channel.send('Your new prefix must be under \`5\` characters.');

        if (data) {
            await prefixModel.findOneAndRemove({
                GuildID: message.guild.id
            })

            let newData = new prefixModel({
                Prefix: args[0],
                GuildID: message.guild.id
            })
            newData.save();
            await message.guild.me.setNickname(`(${args[0]}) Niron`);
            message.channel.send(`You have set your new prefix to **\`${args[0]}\`**`);

            if (logsChannelCheck) {
                if (!logsCheck) return;
                if (!prefixChangeCheck) return;

                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                const prefixEmbed = new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('PREFIX CHANGED')
                    .setDescription(`\`${args[0]}\` has been set as the new server prefix.\n\n**Moderator:** \n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                logsChannel.send(prefixEmbed);
            } else return;

        } else if (!data) {

            let newData = new prefixModel({
                Prefix: args[0],
                GuildID: message.guild.id
            })
            newData.save();
            await message.guild.me.setNickname(`(${args[0]}) Niron`);
            message.channel.send(`You have set your new prefix to **\`${args[0]}\`**`);

            if (logsChannelCheck) {
                if (!logsCheck) return;
                if (!prefixChangeCheck) return;

                const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                const prefixEmbed2 = new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('PREFIX CHANGED')
                    .setDescription(`\`${args[0]}\` has been set as the new server prefix.\n\n**Moderator:** \n${message.author}`)
                    .setFooter(message.author.id)
                    .setTimestamp()
                logsChannel.send(prefixEmbed2);
            } else return;
        }
    }
}