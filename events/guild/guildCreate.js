require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, guild) => {
    console.log(`I have joined ${guild.name}`);

    const welcomeEmbed = new Discord.MessageEmbed()
        .setColor('WHITE')
        .setTitle(`Thanks for inviting Niron to ${guild.name}!`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`I am pleased to help you and make your discord experience better. Please use \`.setup help\` and \`.setup config\` to begin setting up your server. Feel free to use \`.help\` at any time for assistance.\n[Niron Website](https://sites.google.com/view/nironbot)\n[Support Server](https://discord.gg/kMSekQDH5x)\n\nYou can change my prefix in your server by using .prefix (new prefix)!\n\n**I have added level roles to your server. You may change the colour, name and permissions if you wish.**`)
        .setTimestamp()

    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

    //Level 50
    const lvl50mongo = await quickmongo.fetch(`lvl50-${guild.id}`);
    if (!lvl50mongo) {
        guild.roles.create({
            data: {
                name: 'Level 50',
                color: 'BLACK',
            },
            reason: 'Niron level roles'
        }).then(async (role) => {
            let role50 = role.id;
            await quickmongo.set(`lvl50-${guild.id}`, role50);
        })
    }

    //Level 35
    const lvl35mongo = await quickmongo.fetch(`lvl35-${guild.id}`);
    if (!lvl35mongo) {
        guild.roles.create({
            data: {
                name: 'Level 35',
                color: 'BLACK',
            },
            reason: 'Niron level roles'
        }).then(async (role) => {
            let role35 = role.id;
            await quickmongo.set(`lvl35-${guild.id}`, role35);
        })
    }

    //Level 25
    const lvl25mongo = await quickmongo.fetch(`lvl25-${guild.id}`);
    if (!lvl25mongo) {
        guild.roles.create({
            data: {
                name: 'Level 25',
                color: 'BLACK',
            },
            reason: 'Niron level roles'
        }).then(async (role) => {
            let role25 = role.id;
            await quickmongo.set(`lvl25-${guild.id}`, role25);
        })
    }

    //Level 15
    const lvl15mongo = await quickmongo.fetch(`lvl15-${guild.id}`);
    if (!lvl15mongo) {
        guild.roles.create({
            data: {
                name: 'Level 15',
                color: 'BLACK',
            },
            reason: 'Niron level roles'
        }).then(async (role) => {
            let role15 = role.id;
            await quickmongo.set(`lvl15-${guild.id}`, role15);
        })
    }

    //Level 10
    const lvl10mongo = await quickmongo.fetch(`lvl10-${guild.id}`);
    if (!lvl10mongo) {
        guild.roles.create({
            data: {
                name: 'Level 10',
                color: 'BLACK',
            },
            reason: 'Niron level roles'
        }).then(async (role) => {
            let role10 = role.id;
            await quickmongo.set(`lvl10-${guild.id}`, role10);
        })
    }

    //Level 5
    const lvl5mongo = await quickmongo.fetch(`lvl5-${guild.id}`);
    if (!lvl5mongo) {
        guild.roles.create({
            data: {
                name: 'Level 5',
                color: 'BLACK',
            },
            reason: 'Niron level roles'
        }).then(async (role) => {
            let role5 = role.id;
            await quickmongo.set(`lvl5-${guild.id}`, role5);
        })
    }

    channel.send(welcomeEmbed);
}