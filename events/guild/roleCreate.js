require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, role) => {

    const logsChannelCheck = await quickmongo.fetch(`logs-${role.guild.id}`);
    const logsCheck = await quickmongo.fetch(`logslogs-${role.guild.id}`);
    const roleCreateCheck = await quickmongo.fetch(`rolecreate-${role.guild.id}`);

    if (!logsCheck) return;
    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${role.guild.id}`);
        const logsChannel = role.guild.channels.cache.get(getLogsChannel);

        if (roleCreateCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('ROLE CREATED')
                .setDescription(`Name: ${role.name}\nID: ${role.id}`)
                .setTimestamp()
            )
        }
    }
}