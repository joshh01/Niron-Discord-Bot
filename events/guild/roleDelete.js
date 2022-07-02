require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

module.exports = async (Discord, client, role) => {

    const logsChannelCheck = await quickmongo.fetch(`logs-${role.guild.id}`);
    const logsCheck = await quickmongo.fetch(`logslogs-${role.guild.id}`);
    const roleDeleteCheck = await quickmongo.fetch(`roledelete-${role.guild.id}`);

    if (!logsCheck) return;
    if (logsChannelCheck) {

        const getLogsChannel = await quickmongo.get(`logs-${role.guild.id}`);
        const logsChannel = role.guild.channels.cache.get(getLogsChannel);

        if (roleDeleteCheck) {
            logsChannel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('ROLE DELETED')
                .setDescription(`Name: ${role.name}`)
                .setTimestamp()
            )
        }
    }
}