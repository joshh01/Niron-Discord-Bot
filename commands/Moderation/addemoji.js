require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'addemoji',
    aliases: ['emojiadd'],
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: ".addemoji {custom emoji}",
    description: "Adds the emoji(s) that the user sends.",
    async execute(message, args, client, Discord) {
        if (!args.length) return message.channel.send('Please specify some emojis to add.');

        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);

        for (const emojis of args) {
            const getEmoji = Discord.Util.parseEmoji(emojis);

            if (getEmoji.id) {
                const emojiExt = getEmoji.animated ? '.gif' : '.png';
                const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExt}`;
                message.guild.emojis.create(emojiURL, getEmoji.name).then(async emoji => {
                    message.channel.send(`Successfully Added: ${emoji} (\`${emoji.name}\`) to the server.`);

                    if (logsChannelCheck) {

                        const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
                        const logsChannel = message.guild.channels.cache.get(getLogsChannel);

                        const emojiEmbed = new Discord.MessageEmbed()
                            .setColor('GREEN')
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                            .setTitle('EMOJI ADDED')
                            .setDescription(`${emoji} has been added.\nName: \`${emoji.name}\`\n\n**Moderator:** ${message.author}`)
                            .setFooter(message.author.tag)
                            .setTimestamp()
                        logsChannel.send(emojiEmbed);
                    } else return;

                })
            }
        }
    }
}