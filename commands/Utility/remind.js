const ms = require('ms');

module.exports = {
    name: 'remind',
    aliases: ['reminder'],
    cooldown: 5,
    permissions: [],
    usage: ".remind {time} (reminder)",
    description: "Reminds a user in a set period of time.",
    async execute(message, args, client, Discord) {

        let time = args[0];
        let user = message.author
        let reminder = args.splice(1).join(' ')

        const notime = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setDescription(`**Please specify the time!**`)

        const wrongtime = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setDescription(`**Invalid time. I only use d, m, h, or s.**`)

        const reminderembed = new Discord.MessageEmbed()
            .setColor('#F30B04')
            .setDescription(`**Please tell me what you want to be reminded of.**`)

        if (!args[0]) return message.channel.send(notime)
        if (
            !args[0].endsWith("d") &&
            !args[0].endsWith("m") &&
            !args[0].endsWith("h") &&
            !args[0].endsWith("s")
        ) return message.channel.send(wrongtime)

        if (!reminder) return message.channel.send(reminderembed)

        const remindertime = new Discord.MessageEmbed()
            .setColor('#33F304')
            .setDescription(`\**Your reminder will go off in ${time}**`)

        message.channel.send(remindertime)

        const reminderdm = new Discord.MessageEmbed()
            .setColor('#7289DA')
            .setTitle('**REMINDER**')
            .setDescription(`**It has been ${time}, here is your reminder:** ${reminder}`)

        setTimeout(async function () {
            try {
                await user.send(reminderdm)
            } catch (err) {
                message.channel.send(user, reminderdm);
            }
        }, ms(time));
    }
}