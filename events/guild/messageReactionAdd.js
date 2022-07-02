module.exports = async (Discord, client, reaction, user) => {
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (reaction.message.channel.id === "868922708539375677") {
        if (reaction._emoji.id === "869772274331418634") {
            await reaction.message.guild.members.cache.get(user.id).roles.add("869773722305851434");
        } else if (reaction._emoji.id === '869775068010532924') {
            await reaction.message.guild.members.cache.get(user.id).roles.add("869773779256086531")
        }
    }
}