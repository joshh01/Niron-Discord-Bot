const { MessageEmbed } = require('discord.js');

module.exports = {
    name: '8ball',
    aliases: '',
    cooldown: 2,
    permissions: ['SEND_MESSAGES'],
    usage: ".8ball {question}",
    description: "Answers a user's question.",
    async execute(message, args, client, Discord) {

        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Invalid command attempt. Usage:**\n**.8ball [question]**\n\nquestion: any question that you would like');


        if (!args[0]) return message.channel.send(errorEmbed); //If no question

        const replies = ['Yes.', 'No.', 'Definitely.', 'Never.', 'Ask again later', 'Absolutely not.', '1000% yes.', 'Possibly.', 'YES YES!', 'Why would you ever think that?', "You're crazy.", 'Of course.'];
        const result = Math.floor(Math.random() * replies.length); //Randomizes
        const question = args.join(' ');

        if (message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
            const embed = new MessageEmbed()
                .setAuthor('🎱 The 8 Ball says...')
                .setColor('WHITE')
                .addField('Question:', question)
                .addField('Answer:', replies[result]);

            message.channel.send(embed);
        } else {
            message.channel.send(`**Question:**\n${question}\n**Answer:**\n${replies[result]}`);
        }
    }
}