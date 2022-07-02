const { MessageCollector, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guessthenumber',
    aliases: ['gtn', 'numberguess'],
    cooldown: 10,
    permissions: [],
    usage: ".guessthenumber",
    description: "Plays a guess the number game",
    async execute(message, args, client, Discord) {

        let number = Math.ceil(Math.random() * 1000);
        let finished = false;

        message.channel.send(
            new MessageEmbed()
                .setTitle('Guess The Number')
                .setColor('RANDOM')
                .setDescription('Guess a number (1-1000), you have \`1 minute\`')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
        );

        let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
            time: 60000,
        });

        let tries = 0;

        collector.on('collect', async (msg) => {
            if (finished == false) {
                let split = msg.content.split(/ +/);
                let attempt = split.shift();

                if (isNaN(attempt)) return message.reply('You must choose a valid number.');

                tries++;

                if (parseInt(attempt) !== number) return message.reply(`That is incorrect. Please choose again. (My number is ${parseInt(msg) < number ? 'higher' : 'lower'} than ${parseInt(msg)})`);

                finished = true;

                message.channel.send(
                    new MessageEmbed()
                        .setTitle('Correct')
                        .setColor('GREEN')
                        .setDescription(`${parseInt(msg)} is correct!`)
                        .setFooter(`It took you ${tries} tries to get it`)
                        .setTimestamp()
                );
            }
        })

        collector.on('end', async (collected) => {
            if (finished == false) return message.reply('You timed out!');
        })

    }
}