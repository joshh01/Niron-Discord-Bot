const Discord = require('discord.js');
const Intents = require('discord.js');
require("dotenv").config();
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    ws: {
        intents: Intents.All,
    }
});
const mongoose = require('mongoose');

const prefixModel = require('./models/prefix');
const prefix = process.env.PREFIX;

const mongo = require('./mongo');

//Leveling system
const Levels = require('discord-xp');
Levels.setURL(process.env.MONGODB_SRV);

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.snipes = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.on('ready', async () => {
    await mongo().then(mongoose => {
        console.log('Connected to the database!');
    })
})

const { Database } = require('quickmongo');
const quickmongo = new Database(process.env.MONGODB_SRV);
const { badWords } = require('./badwords.json');

//WORD BLACKLIST
client.on('message', async (message, guild) => {
    if (message.author.bot) return;
    if (await quickmongo.fetch(`swear-${message.guild.id}`) === true) {
        if (message.member.hasPermission('ADMINISTRATOR')) return;
        for (let i = 0; i < badWords.length; i++) {

            if (message.content.toLowerCase().includes(badWords[i].toLowerCase())) {
                message.delete();

                message.reply('watch your language.').then(msg => {
                    msg.delete({ timeout: 7000 });
                })
            }
        }
    }
})

//ANTISPAM
let AS = [];

const timeAS = 4; //4 secs
const msgsAS = 7; //7 messages

client.on('message', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!AS[message.author.id]) AS[message.author.id] = {};
    if (!AS[message.author.id][message.guild.id]) AS[message.author.id][message.guild.id] = 1, setTimeout(() => { delete AS[message.author.id][message.guild.id] }, timeAS * 1000);
    else if (AS[message.author.id][message.guild.id] < msgsAS) AS[message.author.id][message.guild.id]++;
    else if (AS[message.author.id][message.guild.id] >= msgsAS) {
        await message.delete().then(e => e.delete({ timeout: 5000 }));
        message.channel.send(`${message.author}, please don't spam!`);
    }
    else AS[message.author.id] = {}, AS[message.author.id][message.guild.id] = 1
    return;
})

//HELP COMMAND USING ORIGINAL PREFIX
client.on('message', async (message) => {
    if (message.content === '.help') {
        const data = await prefixModel.findOne({
            GuildID: message.guild.id
        })
        if (!data) return message.channel.send(`The current server prefix is: **\`.\`**\nPlease use \`.help\` for a detailed list of commands.`);
        const helpPrefix = data.Prefix;
        if (helpPrefix === '.') return;
        message.channel.send(`The current server prefix is: **\`${helpPrefix}\`**\nPlease use \`${helpPrefix}help\` for a detailed list of commands.`);
    }
})

//LEVELING SYSTEM
client.on('message', async (message, guild) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    if (await quickmongo.fetch(`levels-${message.guild.id}`) === true) {
        const randomXP = Math.floor(Math.random() * 9) + 1;
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXP);
        if (hasLeveledUp) {
            const user = await Levels.fetch(message.author.id, message.guild.id);

            const levelupChannelCheck = await quickmongo.fetch(`levelup-${message.guild.id}`);

            if (levelupChannelCheck) {
                const getLevelupChannel = await quickmongo.get(`levelup-${message.guild.id}`);
                const levelupChannel = message.guild.channels.cache.get(getLevelupChannel);

                levelupChannel.send(`Congrats <@${user.userID}>, you leveled up to level ${user.level}!`);
            } else {
                message.channel.send(`Congrats <@${user.userID}>, you leveled up to level ${user.level}!`);
            }

            if (user.level == 5) {
                const lvl5RoleCheck = await quickmongo.fetch(`lvl5-${message.guild.id}`);
                const getlvl5Role = await quickmongo.get(`lvl5-${message.guild.id}`);
                let lvl5Role;

                if (lvl5RoleCheck) {
                    lvl5Role = message.guild.roles.cache.get(getlvl5Role);
                    message.member.roles.add(lvl5Role);
                }
            }

            if (user.level == 10) {
                const lvl10RoleCheck = await quickmongo.fetch(`lvl10-${message.guild.id}`);
                const getlvl10Role = await quickmongo.get(`lvl10-${message.guild.id}`);
                let lvl10Role;

                if (lvl10RoleCheck) {
                    lvl10Role = message.guild.roles.cache.get(getlvl10Role);
                    message.member.roles.add(lvl10Role);
                }
            }

            if (user.level == 15) {
                const lvl15RoleCheck = await quickmongo.fetch(`lvl15-${message.guild.id}`);
                const getlvl15Role = await quickmongo.get(`lvl15-${message.guild.id}`);
                let lvl15Role;

                if (lvl15RoleCheck) {
                    lvl15Role = message.guild.roles.cache.get(getlvl15Role);
                    message.member.roles.add(lvl15Role);
                }
            }

            if (user.level == 25) {
                const lvl25RoleCheck = await quickmongo.fetch(`lvl25-${message.guild.id}`);
                const getlvl25Role = await quickmongo.get(`lvl25-${message.guild.id}`);
                let lvl25Role;

                if (lvl25RoleCheck) {
                    lvl25Role = message.guild.roles.cache.get(getlvl25Role);
                    message.member.roles.add(lvl25Role);
                }
            }

            if (user.level == 35) {
                const lvl35RoleCheck = await quickmongo.fetch(`lvl35-${message.guild.id}`);
                const getlvl35Role = await quickmongo.get(`lvl35-${message.guild.id}`);
                let lvl35Role;

                if (lvl35RoleCheck) {
                    lvl35Role = message.guild.roles.cache.get(getlvl35Role);
                    message.member.roles.add(lvl35Role);
                }
            }

            if (user.level == 50) {
                const lvl50RoleCheck = await quickmongo.fetch(`lvl50-${message.guild.id}`);
                const getlvl50Role = await quickmongo.get(`lvl50-${message.guild.id}`);
                let lvl50Role;

                if (lvl50RoleCheck) {
                    lvl50Role = message.guild.roles.cache.get(getlvl50Role);
                    message.member.roles.add(lvl50Role);
                }
            }
        }
    }
})

//Anti Link
client.on('message', async (message) => {
    if (!message.guild || message.author.bot || message.member.hasPermission('MANAGE_MESSAGES')) return;
    let invs = [];
    await message.guild.fetchInvites().then(inv => {
        inv.forEach(invites => {
            invs.push(invites?.code);
        });
    });
    if (message.guild.fetchVanityData?.code) invs.push(message.guild.fetchVanityData?.code)

    for (let i of ['discord.gg/', 'discord.com/invite/']) {
        if (message.content.includes(i)) {
            if (!invs.length) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`**Please do not send links to other servers!**`)
                    .setColor('RED')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                message.delete();
                return message.reply(``, embed).then(msg => {
                    msg.delete({ timeout: 7000 });
                }).catch(err => console.log(err))
            }

            let args = message.content.split(i);
            args.shift();
            args[0].split(/ +/);

            for (let arg of args) {
                if (!invs.includes(arg)) {
                    const embed2 = new Discord.MessageEmbed()
                        .setDescription(`**Please do not send links to other servers!**`)
                        .setColor('RED')
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                    message.delete();
                    return message.reply(``, embed2);
                }
            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN);