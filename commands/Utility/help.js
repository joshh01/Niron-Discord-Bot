const fs = require('fs');
const prefixModel = require('../../models/prefix');

module.exports = {
    name: 'help',
    aliases: '',
    cooldown: 0,
    permissions: [],
    usage: ".help",
    description: "Sends the help embed.",
    async execute(message, args, client, Discord) {

        const data = await prefixModel.findOne({
            GuildID: message.guild.id
        })
        if (data) {
            const prefix = data.Prefix;
        }
        else {
            prefix = ".";
        }

        if (!args[0]) {
            let categories = [];

            fs.readdirSync('./commands/').forEach(dir => {
                if (dir === 'xyz') return;
                const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

                const cmds = commands.map(command => {
                    let file = require(`../../commands/${dir}/${command}`);

                    if (!file.name) return 'No command name.';

                    let name = file.name.replace('.js', '');

                    return `\`${name}\``;
                })

                let data = new Object();

                data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? 'In progress' : cmds.join(' '),
                };

                categories.push(data);
            })

            const helpEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Help Menu')
                .addFields(categories)
                .setDescription(`Use \`${prefix}help\` with a command name to get command information.
                For help with setup commands, use \`${prefix}setup help\``)
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            return message.channel.send(helpEmbed);

        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase));

            if (!command) {
                const noCommandEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle(`Command not found!`)
                    .setDescription(`Use \`${prefix}help\` to list all commands.`)
                    .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()

                return message.channel.send(noCommandEmbed);
            }

            const helpMenuEmbed = new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('Command Information')
                .addField('Prefix', `\`${prefix}\``)
                .addField('Command', command.name ? `\`${command.name}\`` : '`No Command Name`')
                .addField('Aliases', command.aliases ? `\`${command.aliases.join('` `')}\`` : '`No Aliases`')
                .addField('Cooldown', command.cooldown ? `\`${command.cooldown}\`` : '`No Cooldown`')
                .addField('Description', command.description ? `\`${command.description}\`` : '`No Description`')
                .addField('Usage', command.usage ? `\`${command.usage}\`` : '`No usage`')
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            return message.channel.send(helpMenuEmbed);
        }
    }
}