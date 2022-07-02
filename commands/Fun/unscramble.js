const { MessageCollector } = require('discord.js');

module.exports = {
    name: 'unscramble',
    aliases: ['scramble'],
    cooldown: 4,
    permissions: [],
    usage: '.unscramble',
    description: "Unscramble the given word!",
    async execute(message, args, client, Discord) {
        let words = ['niron', 'football', 'kinematics', 'cellphone', 'television', 'flashlight', 'textbook', 'coffee', 'case',
            'malware', 'update', 'available', 'install', 'close', 'improve', 'version', 'federal', 'table', 'doormat', 'temptation',
            'envelope', 'bag', 'free', 'interest', 'business', 'national', 'code', 'visual', 'dinosaur', 'country', 'district',
            'abyss', 'camera', 'lowercase', 'enter', 'monotone', 'straw', 'cardboard', 'cupboard', 'condition', 'remote', 'wireless'
        ];
        let word = words[parseInt(Math.random() * words.length)];

        let tries = 0;
        let finished = false;

        let scrambled = word.split('');

        scrambled.sort(() => (Math.random() > .5) ? 1 : -1);

        while (scrambled.join('') == word) scrambled.sort(() => (Math.random() > .5) ? 1 : -1);

        //message.channel.send(`Your word is... \`${scrambled.join('')}\`! Unscramble the given word.`);
        message.channel.send(new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Unscramble')
            .setDescription(`Your word is...
             \`${scrambled.join('')}\`!`)
            .setFooter('Unscramble the word! You have 30 seconds')
        )

        const collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
            time: 30000,
        });

        collector.on('collect', async (msg) => {
            if (finished == false) {
                tries++;

                if (msg.content.toLowerCase() !== word) return message.channel.send(`**${msg}** is incorrect.`);

                finished = true;

                message.channel.send(new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Correct')
                    .setDescription(`Scramble: ${scrambled.join('')}\nCorrect Answer: ${word}`)
                    .setFooter(`It took you ${tries} tries to get it`)
                    .setTimestamp()
                )
            }
        });

        collector.on('end', async (collected) => {
            if (finished == false) return message.channel.reply(`You timed out! The correct answer was ${word}`)
            //if (collected.size == 0) message.channel.send(`You timed out! Respond quicker next time.`);
        });
    }
}