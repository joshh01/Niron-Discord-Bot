module.exports = {
    name: 'bugreport',
    aliases: ['reportbug'],
    cooldown: 60,
    permissions: [],
    usage: ".bugreport {bug}",
    description: 'Lets a user report a bug',
    async execute(message, args, client, Discord) {

        const channel = client.channels.cache.get('868887199104520232');
        const query = args.join(' ');

        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Invalid command attempt. Usage:**\n.bugreport [bug]\n\nbug: any string of words / letters explaining the bug')

        if (!query) return message.channel.send(errorEmbed)

        const reportEmbed = new Discord.MessageEmbed()
            .setTitle('New Bug Report!')
            .addField('Author', message.author.toString(), true)
            .addField('Guild', message.guild.name, true)
            .addField('Report', query)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        channel.send(reportEmbed);
        message.channel.send('**Bug report has been sent!**');

    }
}