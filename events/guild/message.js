const cooldowns = new Map();
require('dotenv').config();
const inlinereply = require('discord-reply');
const prefix = require('../../models/prefix');

module.exports = async (Discord, client, message) => {



    if (message.channel.type === 'dm') {
        if (message.author.bot) return;
        //if (message.content.startsWith(prefix)) return message.author.send('Hey there! Commands cannot be used in dms. Please use commands in a server that I am in.');
        const dmEmbed = new Discord.MessageEmbed()
            //.setTitle('New dm!')
            //.setColor('WHITE')
            //.setDescription(`User: ${message.author.tag}\nSent At: ${new Date()}\n\n**Message Content:** ${message.content}`)
            //.setFooter(`Niron 2021 | ID: ${message.author.id}`, 'https://cdn.discordapp.com/avatars/861004357284659220/94851f1073edf67da326513f5d588464.webp');
            .setTitle('New DM!')
            .addField('Author', message.author.toString(), true)
            .addField('Message', message.content)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        const DML = client.channels.cache.get('868687460677353492');
        DML.send(dmEmbed);
    }

    //COMMANDS

    const data = await prefix.findOne({
        GuildID: message.guild.id
    })

    const messageArray = message.content.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    if (data) {
        const prefix = data.Prefix;

        if (message.content.startsWith(prefix)) {
            if (!message.author.bot) {
                const args = message.content.slice(prefix.length).split(/ +/);
                const cmd = args.shift().toLowerCase();

                const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
                if (!command) return;

                //PERMISSIONS

                const validPermissions = Object.keys(Discord.Permissions.FLAGS);

                if (command.permissions.length) {
                    let invalidPermissions = []
                    for (const perm of command.permissions) {
                        if (!validPermissions.includes(perm)) {
                            return console.log(`Invalid permissions: ${perm}`);
                        }
                        if (!message.member.permissions.has(perm)) { //IT WAS member.hasPermission AAAAAAAAAAAAAAAAAAAAAAAAA---------------
                            invalidPermissions.push(perm);
                        }
                    }
                    if (invalidPermissions.length) {
                        return message.channel.send(`${message.author}, you do not have permission to use this command.`);
                    }
                }

                //COOLDOWN

                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection());
                }

                const currentTime = Date.now();
                const timestamps = cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown) * 1000;

                //PREMIUM USERS

                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                    if (currentTime < expirationTime) {
                        const timeLeft = (expirationTime - currentTime) / 1000;

                        return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before using ${command.name} again.`);
                    }
                }

                timestamps.set(message.author.id, currentTime);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                try {
                    command.execute(message, args, client, Discord);
                } catch (err) {
                    message.reply('There was an error trying to execute this command.');
                    console.log(err);
                }
            }
        }

    } else if (!data) {
        const prefix = process.env.PREFIX;

        if (message.content.startsWith(prefix)) {
            if (!message.author.bot) {
                const args = message.content.slice(prefix.length).split(/ +/);
                const cmd = args.shift().toLowerCase();

                const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
                if (!command) return;

                //PERMISSIONS

                const validPermissions = Object.keys(Discord.Permissions.FLAGS);

                if (command.permissions.length) {
                    let invalidPermissions = []
                    for (const perm of command.permissions) {
                        if (!validPermissions.includes(perm)) {
                            return console.log(`Invalid permissions: ${perm}`);
                        }
                        if (!message.member.permissions.has(perm)) { //IT WAS member.hasPermission AAAAAAAAAAAAAAAAAAAAAAAAA---------------
                            invalidPermissions.push(perm);
                        }
                    }
                    if (invalidPermissions.length) {
                        return message.channel.send(`${message.author}, you do not have permission to use this command.`);
                    }
                }

                //COOLDOWN

                if (!cooldowns.has(command.name)) {
                    cooldowns.set(command.name, new Discord.Collection());
                }

                const currentTime = Date.now();
                const timestamps = cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown) * 1000;

                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                    if (currentTime < expirationTime) {
                        const timeLeft = (expirationTime - currentTime) / 1000;

                        return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before using ${command.name} again.`);
                    }
                }

                timestamps.set(message.author.id, currentTime);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                try {
                    command.execute(message, args, client, Discord);
                } catch (err) {
                    message.reply('There was an error trying to execute this command.');
                    console.log(err);
                }
            }
        }

    }
}
