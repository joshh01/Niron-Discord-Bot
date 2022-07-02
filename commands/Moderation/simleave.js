module.exports = {
    name: 'simleave',
    aliases: '',
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: ".simleave",
    description: "Simulates a member leaving.",
    execute(message, args, client, Discord) {

        client.on('guildMemberRemove', (member) => {
            //message.channel.send(`${member} has left the server!`);
            message.channel.send('Simulated leave event.');
        })

        client.emit('guildMemberRemove', message.member);
    }
}