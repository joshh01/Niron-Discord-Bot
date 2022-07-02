require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = {
    name: 'snipe',
    aliases: ['s'],
    cooldown: 0,
    permissions: [],
    usage: '.snipe',
    description: "Shows the last deleted message.",
    async execute(message, args, client, Discord) {

        const staffRoleCheck = await quickmongo.fetch(`staffrole-${message.guild.id}`);
        const getStaffRole = await quickmongo.get(`staffrole-${message.guild.id}`);
        let staffRole;
        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        let modRole;

        if (modRoleCheck || staffRoleCheck) {
            modRole = message.guild.roles.cache.get(getModRole);
            staffRole = message.guild.roles.cache.get(getStaffRole);
        } else return message.channel.send('Please set up **Mod / Staff Roles** before using this command.\n**NOTE:** staff can only mute and kick members, where mods can kick, mute and ban mmebers.');

        if (!modRole) {
            if (!message.member.roles.cache.has(staffRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        if (!staffRole) {
            if (!message.member.roles.cache.has(modRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        if (modRole && staffRole) {
            if (!message.member.roles.cache.has(modRole.id) && !message.member.roles.cache.has(staffRole.id)) return message.channel.send('You do not have permission to use this command.');
        }

        const msg = client.snipes.get(message.channel.id);
        if (!msg) return message.channel.send('No deleted message found!');
        const embed = new Discord.MessageEmbed()
            .setColor('GREY')
            .setAuthor(msg.author)
            .setDescription(msg.content)
            .setFooter('Sniped by Niron')
            .setTimestamp()
        message.channel.send(embed);
    }
}