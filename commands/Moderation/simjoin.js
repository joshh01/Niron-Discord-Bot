module.exports = {
    name: 'simjoin',
    aliases: '',
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: ".simjoin",
    description: "Simulates a member joining.",
    execute(message, args, client, Discord) {

        client.on('guildMemberAdd', (member) => {
            //message.channel.send(`${member} has joined the server!`);
            message.channel.send('Simulated join event.');
        })

        client.emit('guildMemberAdd', message.member);
    }
}