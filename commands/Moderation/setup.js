require('dotenv').config();
const { Database } = require('quickmongo');
const mongoDBURL = process.env.MONGODB_SRV;
const quickmongo = new Database(mongoDBURL);

const prefixModel = require('../../models/prefix');

module.exports = {
    name: 'setup',
    aliases: '',
    cooldown: 0,
    permissions: ['ADMINISTRATOR'],
    usage: ".setup help",
    description: "Command to setup the bot for your server.",
    async execute(message, args, client, Discord) {

        let prefix;
        const data = await prefixModel.findOne({
            GuildID: message.guild.id
        })
        if (data) prefix = data.Prefix;
        if (!data) prefix = '.';

        let choice = args[0];

        const nochoiceEmbed = new Discord.MessageEmbed()
            .setColor('WHITE')
            .setTitle('❕ No Choice Selected')
            .setDescription(`Please select which section you would like to setup.\n For anticurse and antilink, use \`.acenable/.acdisable\` and \`.alenable/.aldisable\`\n\n**Prefix:** **\`${prefix}\`**\n\n**NOTE:** Use ${prefix}setup help <section-name> for help with any section.`)
            .addField('Usage', `${prefix}setup <section-name> [value]`)
            .addField(`\u200B`, '__General__')
            .addField('👋 Welcome Channel', 'Section Name: **welcomeChannel**')
            .addField('🚶‍♂️ Goodbye Channel', 'Section Name: **goodbyeChannel**')
            .addField('🌐 Autorole', 'Section Name: **autoRole**')
            .addField(`\u200B`, '__Moderation__')
            .addField('🔨 Logs Channel', 'Section Name: **logsChannel**')
            .addField('🛠️ Logs', 'Section Name: **logs**')
            .addField('🧑 Member Role', 'Section Name: **memberRole**')
            .addField('⛔ Mute Role', 'Section Name: **mutedRole**')
            .addField('⛔ Mod Role', 'Section Name: **modRole**')
            .addField('⛔ Staff Role', 'Section Name: **staffRole**')
            .addField('🦿 Alt Kick', 'Section name: **altKick**')
            .addField(`\u200B`, '__Features__')
            .addField('🤬 Anticurse', 'Section Name: **anticurse-enable/disable**')
            .addField('❌ Antilink', 'Section Name: **antilink-enable/disable**')
            .addField('❌ Antispam', 'Section Name: **antiSpam**')
            .addField('📋 Levels', 'Section Name: **levels**')
            .addField('🚀 Levelup Channel', 'Section Name: **levelupChannel**');

        if (!choice) return message.channel.send(nochoiceEmbed);

        /* Quick Mongo for Welcome Channel */
        const getWelcomeChannel = await quickmongo.get(`welcome-${message.guild.id}`);
        const welcomeChannelCheck = await quickmongo.fetch(`welcome-${message.guild.id}`);
        let welcomeChannelStatus;

        if (welcomeChannelCheck) {
            welcomeChannelStatus = `<#${getWelcomeChannel}>`;
        } else welcomeChannelStatus = '`No Channel Set`';

        /* Quick Mongo for Leave Channel */
        const getLeaveChannel = await quickmongo.get(`leave-${message.guild.id}`);
        const leaveChannelCheck = await quickmongo.fetch(`leave-${message.guild.id}`);
        let leaveChannelStatus;

        if (leaveChannelCheck) {
            leaveChannelStatus = `<#${getLeaveChannel}>`;
        } else leaveChannelStatus = '`No Channel Set`';

        /* Quick Mongo for Logs Channel */
        const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`);
        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        let logsChannelStatus;

        if (logsChannelCheck) {
            logsChannelStatus = `<#${getLogsChannel}>`;
        } else logsChannelStatus = '`No Channel Set`';

        /* Quick Mongo for Member Role */
        const getMemberRole = await quickmongo.get(`memberrole-${message.guild.id}`);
        const memberRoleCheck = await quickmongo.fetch(`memberrole-${message.guild.id}`);
        let memberRoleStatus;

        if (memberRoleCheck) {
            memberRoleStatus = `<@&${getMemberRole}>`;
        } else memberRoleStatus = '`No Role Set`';

        /* Quick Mongo for Muted Role */
        const getMuteRole = await quickmongo.get(`muterole-${message.guild.id}`);
        const muteRoleCheck = await quickmongo.fetch(`muterole-${message.guild.id}`);
        let muteRoleStatus;

        if (muteRoleCheck) {
            muteRoleStatus = `<@&${getMuteRole}>`;
        } else muteRoleStatus = '`No Role Set`';

        /* Quick Mongo for Mod Role */
        const getModRole = await quickmongo.get(`modrole-${message.guild.id}`);
        const modRoleCheck = await quickmongo.fetch(`modrole-${message.guild.id}`);
        let modRoleStatus;

        if (modRoleCheck) {
            modRoleStatus = `<@&${getModRole}>`;
        } else modRoleStatus = '`No Role Set`';

        /* Quick Mongo for Staff Role */
        const getStaffRole = await quickmongo.get(`staffrole-${message.guild.id}`);
        const staffRoleCheck = await quickmongo.fetch(`staffrole-${message.guild.id}`);
        let staffRoleStatus;

        if (staffRoleCheck) {
            staffRoleStatus = `<@&${getStaffRole}>`;
        } else staffRoleStatus = '`No Role Set`';

        /* Quick Mongo for AutoRole */
        const autoRoleCheck = await quickmongo.fetch(`autorole-${message.guild.id}`);
        let autoRoleStatus;

        if (autoRoleCheck) {
            autoRoleStatus = '🟢 (ON)';
        } else autoRoleStatus = '🔴 (OFF)';

        /* Quick Mongo for Anticurse Feature */
        const anticurseCheck = await quickmongo.fetch(`swear-${message.guild.id}`);
        let anticurseStatus;

        if (anticurseCheck === true) {
            anticurseStatus = '🟢 (ON)';
        } else anticurseStatus = '🔴 (OFF)';

        /* Quick Mongo for Antilink Feature */
        const antilinkCheck = await quickmongo.fetch(`link-${message.guild.id}`);
        let antilinkStatus;

        if (antilinkCheck === true) {
            antilinkStatus = '🟢 (ON)';
        } else antilinkStatus = '🔴 (OFF)';

        /* Quick Mongo for Levels Feature */
        const levelsCheck = await quickmongo.fetch(`levels-${message.guild.id}`);
        let levelsStatus;

        if (levelsCheck === true) {
            levelsStatus = '🟢 (ON)';
        } else levelsStatus = '🔴 (OFF)';

        /*Quick Mongo for Levelup Channel */
        const getlevelupChannel = await quickmongo.get(`levelup-${message.guild.id}`);
        const levelupChannelCheck = await quickmongo.fetch(`levelup-${message.guild.id}`);
        let levelupChannelStatus;

        if (levelupChannelCheck) {
            levelupChannelStatus = `<#${getlevelupChannel}>`;
        } else levelupChannelStatus = '\`No Channel Set\`';

        /*Quick Mongo for Alt Kick Feature */
        const altKickCheck = await quickmongo.fetch(`altKick-${message.guild.id}`);
        let altKickStatus;

        if (altKickCheck === true) {
            altKickStatus = '🟢 (ON)';
        } else altKickStatus = '🔴 (OFF)';

        /*Quick Mongo for Antispam */
        const antiSpamCheck = await quickmongo.fetch(`as-${message.guild.id}`);
        let antiSpamStatus;

        if (antiSpamCheck === true) {
            antiSpamStatus = '🟢 (ON)';
        } else antiSpamStatus = '🔴 (OFF)';

        /* Quick Mongo for Logs Logs */
        const logsCheck = await quickmongo.fetch(`logslogs-${message.guild.id}`);
        let logsStatus;

        if (logsCheck) {
            logsStatus = '🟢 (ON)';
        } else logsStatus = '🔴 (OFF)';

        /*Quick Mongo for Alt Kick Logs */
        const altKickLogsCheck = await quickmongo.fetch(`altKickLogs-${message.guild.id}`);
        let altKickLogsStatus;

        if (altKickLogsCheck === true) {
            altKickLogsStatus = '🟢 (ON)';
        } else altKickLogsStatus = '🔴 (OFF)';

        /*Quick Mongo for Member Join Logs */
        const memberJoinCheck = await quickmongo.fetch(`memberJoin-${message.guild.id}`);
        let memberJoinStatus;

        if (memberJoinCheck === true) {
            memberJoinStatus = '🟢 (ON)';
        } else memberJoinStatus = '🔴 (OFF)';

        /*Quick Mongo for Member Leave Logs */
        const memberLeaveCheck = await quickmongo.fetch(`memberLeave-${message.guild.id}`);
        let memberLeaveStatus;

        if (memberLeaveCheck === true) {
            memberLeaveStatus = '🟢 (ON)';
        } else memberLeaveStatus = '🔴 (OFF)';

        /*Quick Mongo for Message Purged Logs */
        const messagePurgeCheck = await quickmongo.fetch(`messagePurge-${message.guild.id}`);
        let messagePurgeStatus;

        if (messagePurgeCheck === true) {
            messagePurgeStatus = '🟢 (ON)';
        } else messagePurgeStatus = '🔴 (OFF)';

        /*Quick Mongo for Message Delete Logs */
        const messageDeleteCheck = await quickmongo.fetch(`messageDelete-${message.guild.id}`);
        let messageDeleteStatus;

        if (messageDeleteCheck === true) {
            messageDeleteStatus = '🟢 (ON)';
        } else messageDeleteStatus = '🔴 (OFF)';

        /*Quick Mongo for Message Edit Logs */
        const messageEditCheck = await quickmongo.fetch(`messageEdit-${message.guild.id}`);
        let messageEditStatus;

        if (messageEditCheck === true) {
            messageEditStatus = '🟢 (ON)';
        } else messageEditStatus = '🔴 (OFF)';

        /*Quick Mongo for Member Kick Logs */
        const memberKickCheck = await quickmongo.fetch(`memberKick-${message.guild.id}`);
        let memberKickStatus;

        if (memberKickCheck === true) {
            memberKickStatus = '🟢 (ON)';
        } else memberKickStatus = '🔴 (OFF)';

        /*Quick Mongo for Member Ban Logs */
        const memberBanCheck = await quickmongo.fetch(`memberBan-${message.guild.id}`);
        let memberBanStatus;

        if (memberBanCheck === true) {
            memberBanStatus = '🟢 (ON)';
        } else memberBanStatus = '🔴 (OFF)';

        /*Quick Mongo for Prefix Change Logs */
        const prefixChangeCheck = await quickmongo.fetch(`prefixChange-${message.guild.id}`);
        let prefixChangeStatus;

        if (prefixChangeCheck === true) {
            prefixChangeStatus = '🟢 (ON)';
        } else prefixChangeStatus = '🔴 (OFF)';

        /*Quick Mongo for Mute Logs */
        const muteCheck = await quickmongo.fetch(`mutelogs-${message.guild.id}`);
        let muteStatus;

        if (muteCheck === true) {
            muteStatus = '🟢 (ON)';
        } else muteStatus = '🔴 (OFF)';

        /*Quick Mongo for Anticurse Logs */
        const acCheck = await quickmongo.fetch(`aclogs-${message.guild.id}`);
        let acStatus;

        if (acCheck === true) {
            acStatus = '🟢 (ON)';
        } else acStatus = '🔴 (OFF)';

        /*Quick Mongo for Antilink Logs */
        const alCheck = await quickmongo.fetch(`allogs-${message.guild.id}`);
        let alStatus;

        if (alCheck === true) {
            alStatus = '🟢 (ON)';
        } else alStatus = '🔴 (OFF)';

        /*Quick Mongo for Warn Logs */
        const warnCheck = await quickmongo.fetch(`warnlogs-${message.guild.id}`);
        let warnStatus;

        if (warnCheck === true) {
            warnStatus = '🟢 (ON)';
        } else warnStatus = '🔴 (OFF)';

        /*Quick Mongo for Channel Create Logs */
        const channelCreateCheck = await quickmongo.fetch(`channelcreate-${message.guild.id}`);
        let channelCreateStatus;

        if (channelCreateCheck === true) {
            channelCreateStatus = '🟢 (ON)';
        } else channelCreateStatus = '🔴 (OFF)';

        /*Quick Mongo for Channel Delete Logs */
        const channelDeleteCheck = await quickmongo.fetch(`channeldelete-${message.guild.id}`);
        let channelDeleteStatus;

        if (channelDeleteCheck === true) {
            channelDeleteStatus = '🟢 (ON)';
        } else channelDeleteStatus = '🔴 (OFF)';

        /*Quick Mongo for Role Create Logs */
        const roleCreateCheck = await quickmongo.fetch(`rolecreate-${message.guild.id}`);
        let roleCreateStatus;

        if (roleCreateCheck === true) {
            roleCreateStatus = '🟢 (ON)';
        } else roleCreateStatus = '🔴 (OFF)';

        /*Quick Mongo for Role Delete Logs */
        const roleDeleteCheck = await quickmongo.fetch(`roledelete-${message.guild.id}`);
        let roleDeleteStatus;

        if (roleDeleteCheck === true) {
            roleDeleteStatus = '🟢 (ON)';
        } else roleDeleteStatus = '🔴 (OFF)';

        if (choice === 'help') {
            let category = args[1];
            if (!category) return message.channel.send(new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle('SETUP HELP')
                .setDescription(`**Use ${prefix}setup help <category>\nHere are a list of categories which you may choose:**\n\n\`welcomeChannel\`, \`goodbyeChannel\`, \`autoRole\`, \`logsChannel\`, \`logs\`, \`memberRole\`, \`mutedRole\`, \`modRole\`, \`staffRole\`, \`antiCurse\`, \`antiLink\`, \`altKick\`, \`levels\`, \`levelupChannel\`\n\n**To view your current settings, use ${prefix}setup config.**`)
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            )

            if (category === 'welcomeChannel') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Welcome Channel Help')
                    .setDescription(`**Usage:** ${prefix}setup welcomeChannel {#channel}\n\n**Description:** if enabled, a message is sent to this channel when a new member joins. To disable this feature, simply use **${prefix}setup welcomeChannel reset** .`)
                );
            }

            if (category === 'goodbyeChannel') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Goodbye Channel Help')
                    .setDescription(`**Usage:** ${prefix}setup goodbyeChannel {#channel}\n\n**Description:** if enabled, a message is sent to this channel when a member leaves. To disable this feature, simply use **${prefix}setup goodbyeChannel reset** .`)
                );
            }

            if (category === 'autoRole') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Auto Role Help')
                    .setDescription(`**Usage:** ${prefix}setup autoRole {enable / disable}\n\n**Description:** if enabled, every new member that joins the server will get your **member role**. In addition, if this is disabled, if a muted member leaves and rejoins your server they will not be muted. To disable this feature, simply use **${prefix}setup autoRole reset** .`)
                );
            }

            if (category === 'logsChannel') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Logs Channel Help')
                    .setDescription(`**Usage:** ${prefix}setup logsChannel {#channel}\n\n**Description:** if enabled, a message is sent to this channel when an action is performed. \`${prefix}setup help logs\` will go more in depth on this. To disable this feature, simply use **${prefix}setup logsChannel reset** .`)
                );
            }

            if (category === 'logs') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Logs Help')
                    .setDescription(`**Usage:** ${prefix}setup logs {enable / disable}\n\n**Description:** if enabled, logs for actions will be sent to your logs channel. You can customize EVERY log using \`${prefix}setup logs\`. To disable this feature, simply use **${prefix}setup logs disable** .`)
                );
            }

            if (category === 'memberRole') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Member Role Help')
                    .setDescription(`**Usage:** ${prefix}setup memberRole {@role}\n\n**Description:** if enabled, every new member that joins the server will get this role. In addition, this feature will only work if **autoRole** is enabled. To disable this feature, simply use **${prefix}setup autoRole reset** .`)
                );
            }

            if (category === 'mutedRole') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Muted Role Help')
                    .setDescription(`**Usage:** ${prefix}setup mutedRole {@role}\n\n**Description:** if enabled, this role will be given to a member when they are muted. To disable this feature, simply use **${prefix}setup mutedRole reset** .`)
                );
            }

            if (category === 'modRole') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Mod Role Help')
                    .setDescription(`**Usage:** ${prefix}setup modRole {@role}\n\n**Description:** if enabled, this role will be used to run commands. Mods have the ability to: **ban, kick, mute, warn & clear warns**, so be careful who you give this to! To disable this feature, simply use **${prefix}setup modRole reset** .`)
                );
            }

            if (category === 'staffRole') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Staff Role Help')
                    .setDescription(`**Usage:** ${prefix}setup staffRole {@role}\n\n**Description:** if enabled, this role will be used to run commands. Mods have the ability to: **kick, mute, & warn**, so be careful who you give this to! To disable this feature, simply use **${prefix}setup staffRole reset** .`)
                );
            }

            if (category === 'antiCurse') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Anti Curse Help')
                    .setDescription(`**Usage:** ${prefix}acenable\n\n**Description:** if enabled, any message containing a curse word will be deleted. To disable this feature, simply use **${prefix}acdisable** .`)
                );
            }

            if (category === 'antiLink') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Anti Link Help')
                    .setDescription(`**Usage:** ${prefix}alenable\n\n**Description:** if enabled, any message containing a discord invite link (not to your server) will be deleted. To disable this feature, simply use **${prefix}aldisable** .`)
                );
            }

            if (category === 'altKick') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Alt Kick Help')
                    .setDescription(`**Usage:** ${prefix}setup altKick {enable / disable}\n\n**Description:** if enabled, any new member whose account is less than a week old will be kicked. To disable this feature, simply use **${prefix}setup altKick disable** .`)
                );
            }

            if (category === 'antiSpam') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Anti Spam Help')
                    .setDescription(`**Usage:** ${prefix}setup antiSpam {enable / disable}\n\n**Description:** if enabled, any member who sends more than 7 messages within 4 seconds will have the extra messages deleted. To disable this feature, simply use **${prefix}setup antiSpam disable** .`)
                );
            }

            if (category === 'levels') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Levels Help')
                    .setDescription(`**Usage:** ${prefix}setup levels {enable / disable}\n\n**Description:** if enabled, members will get xp & roles for sending messages in chat. To disable this feature, simply use **${prefix}setup levels disable** .`)
                );
            }

            if (category === 'levelupChannel') {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Levelup Channel Help')
                    .setDescription(`**Usage:** ${prefix}setup levelupChannel {#channel}\n\n**Description:** if enabled, xp levelup messages will be sent to this channel. If there is no channel set, the message will be sent in the current channel. To disable this feature, simply use **${prefix}setup levelupChannel reset** .`)
                );
            }
        }

        if (choice === 'welcomeChannel') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`welcome-${message.guild.id}`);
                message.channel.send('**Welcome channel** has been reset.');
            } else {

                const welcomeChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

                if (!welcomeChannel) return message.channel.send('Please specify a valid channel.');

                await quickmongo.set(`welcome-${message.guild.id}`, welcomeChannel.id);

                message.channel.send(`You have set ${welcomeChannel} as your welcome channel.`);
            }
        }

        if (choice === 'goodbyeChannel') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`leave-${message.guild.id}`);
                message.channel.send('Leave channel has been reset.');
            } else {

                const leaveChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

                if (!leaveChannel) return message.channel.send('Please specify a valid channel.');

                await quickmongo.set(`leave-${message.guild.id}`, leaveChannel.id);

                message.channel.send(`You have set ${leaveChannel} as your leave channel.`);
            }
        }

        if (choice === 'logsChannel') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`logs-${message.guild.id}`);
                message.channel.send('Logs channel has been reset.');
            } else {

                const logsChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

                if (!logsChannel) return message.channel.send('Please specify a valid channel.');

                await quickmongo.set(`logs-${message.guild.id}`, logsChannel.id);

                message.channel.send(`You have set ${logsChannel} as your logs channel.`);
            }
        }

        if (choice === 'logs') {
            const logsEmbed = new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle(`Niron Logs | ${logsStatus}`)
                .addField('Usage', `${prefix}setup logs <section> [value]\nTo reset a value, simply use \`none\` or \`reset\`.\nTo get a section name, choose one of the following.`)
                .addField('Member Join | Section Name: **memberJoin**', `\`${memberJoinStatus}\``, true)
                .addField('Member Leave | Section Name: **memberLeave**', `\`${memberLeaveStatus}\``, true)
                .addField('Message Delete | Section Name: **messageDelete**', `\`${messageDeleteStatus}\``, true)
                .addField('Message Edit | Section Name: **messageEdit**', `\`${messageEditStatus}\``, true)
                .addField('Member Kick | Section Name: **memberKick**', `\`${memberKickStatus}\``, true)
                .addField('Member Ban | Section Name: **memberBan**', `\`${memberBanStatus}\``, true)
                .addField('Prefix Change | Section Name: **prefixChange**', `\`${prefixChangeStatus}\``, true)
                .addField('Mute | Unmute | Section Name: **mute**', `\`${muteStatus}\``, true)
                .addField('Warn | Section Name: **warn**', `\`${warnStatus}\``, true)
                .addField('Anticurse Update | Section Name: **anticurse**', `\`${acStatus}\``, true)
                .addField('Antilink Update | Section Name: **antilink**', `\`${alStatus}\``, true)
                .addField('Alt Kick | Section Name: **altKick**', `\`${altKickLogsStatus}\``, true)
                .addField('Messages Purged | Section Name: **messagePurge**', `\`${messagePurgeStatus}\``, true)
                .addField('Channel Created | Section Name: **channelCreate**', `\`${channelCreateStatus}\``, true)
                .addField('Channel Deleted | Section Name: **channelDelete**', `\`${channelDeleteStatus}\``, true)
                .addField('Role Created | Section Name: **roleCreate**', `\`${roleCreateStatus}\``, true)
                .addField('Role Deleted | Section Name: **roleDelete**', `\`${roleDeleteStatus}\``, true)

            let query = args[1];
            if (!query) {
                message.channel.send(logsEmbed);
                message.channel.send(`You may use \`${prefix}setup logs {enable/disable} all\` to quickly enable or disable all logs.`);
                return;
            }

            if (!logsChannelCheck) return message.channel.send('Please setup **Logs Channel** before using logs.');

            if (query === 'enable') {
                const yesno = args[2];

                if (yesno === 'all') {
                    await quickmongo.set(`logslogs-${message.guild.id}`, true);
                    await quickmongo.set(`memberJoin-${message.guild.id}`, true);
                    await quickmongo.set(`memberLeave-${message.guild.id}`, true);
                    await quickmongo.set(`messagePurge-${message.guild.id}`, true);
                    await quickmongo.set(`messageDelete-${message.guild.id}`, true);
                    await quickmongo.set(`messageEdit-${message.guild.id}`, true);
                    await quickmongo.set(`memberKick-${message.guild.id}`, true);
                    await quickmongo.set(`memberBan-${message.guild.id}`, true);
                    await quickmongo.set(`prefixChange-${message.guild.id}`, true);
                    await quickmongo.set(`mutelogs-${message.guild.id}`, true);
                    await quickmongo.set(`warnlogs-${message.guild.id}`, true);
                    await quickmongo.set(`aclogs-${message.guild.id}`, true);
                    await quickmongo.set(`allogs-${message.guild.id}`, true);
                    await quickmongo.set(`altKickLogs-${message.guild.id}`, true);
                    await quickmongo.set(`channelcreate-${message.guild.id}`, true);
                    await quickmongo.set(`channeldelete-${message.guild.id}`, true);
                    await quickmongo.set(`rolecreate-${message.guild.id}`, true);
                    await quickmongo.set(`roledelete-${message.guild.id}`, true);
                    message.channel.send('**ALL** logs have been enabled.');
                    return;
                }

                if (await quickmongo.fetch(`logslogs-${message.guild.id}`) === null) {
                    await quickmongo.set(`logslogs-${message.guild.id}`, true);
                    return message.channel.send('Logs have been **ENABLED**.');
                } else if (await quickmongo.fetch(`logslogs-${message.guild.id}`) === false) {
                    await quickmongo.set(`logslogs-${message.guild.id}`, true);
                    return message.channel.send('Logs have been **ENABLED.**');
                } else return message.channel.send('Logs have **ALREADY BEEN ENABLED.**');
            }

            if (query === 'disable') {
                const yesno = args[2];

                if (yesno === 'all') {
                    await quickmongo.delete(`logslogs-${message.guild.id}`);
                    await quickmongo.delete(`memberJoin-${message.guild.id}`);
                    await quickmongo.delete(`memberLeave-${message.guild.id}`);
                    await quickmongo.delete(`messagePurge-${message.guild.id}`);
                    await quickmongo.delete(`messageDelete-${message.guild.id}`);
                    await quickmongo.delete(`messageEdit-${message.guild.id}`);
                    await quickmongo.delete(`memberKick-${message.guild.id}`);
                    await quickmongo.delete(`memberBan-${message.guild.id}`);
                    await quickmongo.delete(`prefixChange-${message.guild.id}`);
                    await quickmongo.delete(`mutelogs-${message.guild.id}`);
                    await quickmongo.delete(`warnlogs-${message.guild.id}`);
                    await quickmongo.delete(`aclogs-${message.guild.id}`);
                    await quickmongo.delete(`allogs-${message.guild.id}`);
                    await quickmongo.delete(`altKickLogs-${message.guild.id}`);
                    await quickmongo.delete(`channelcreate-${message.guild.id}`);
                    await quickmongo.delete(`channeldelete-${message.guild.id}`);
                    await quickmongo.delete(`rolecreate-${message.guild.id}`);
                    await quickmongo.delete(`roledelete-${message.guild.id}`);
                    message.channel.send('**ALL** logs have been disabled.');
                    return;
                }

                if (await quickmongo.fetch(`logslogs-${message.guild.id}`) === true) {
                    await quickmongo.delete(`logslogs-${message.guild.id}`);
                    return message.channel.send('Logs have been **DISABLED.**');
                } else return message.channel.send('Logs have **ALREADY BEEN DISABLED.**');
            }

            if (query === 'memberJoin') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`memberJoin-${message.guild.id}`) === null) {
                        await quickmongo.set(`memberJoin-${message.guild.id}`, true);
                        return message.channel.send('Member Join logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`memberJoin-${message.guild.id}`) === false) {
                        await quickmongo.set(`memberJoin-${message.guild.id}`);
                        return message.channel.send('Member Join logs have been **ENABLED**');
                    } else return message.channel.send('Member Join logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`memberJoin-${message.guild.id}`) === true) {
                        await quickmongo.delete(`memberJoin-${message.guild.id}`);
                        return message.channel.send('Member Join logs have been **DISABLED.**');
                    } else return message.channel.send('Member Join logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'memberLeave') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`memberLeave-${message.guild.id}`) === null) {
                        await quickmongo.set(`memberLeave-${message.guild.id}`, true);
                        return message.channel.send('Member Leave logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`memberLeave-${message.guild.id}`) === false) {
                        await quickmongo.set(`memberLeave-${message.guild.id}`);
                        return message.channel.send('Member Leave logs have been **ENABLED**');
                    } else return message.channel.send('Member Leave logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`memberLeave-${message.guild.id}`) === true) {
                        await quickmongo.delete(`memberLeave-${message.guild.id}`);
                        return message.channel.send('Member Leave logs have been **DISABLED.**');
                    } else return message.channel.send('Member Leave logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'messagePurge') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`messagePurge-${message.guild.id}`) === null) {
                        await quickmongo.set(`messagePurge-${message.guild.id}`, true);
                        return message.channel.send('Message Purge logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`messagePurge-${message.guild.id}`) === false) {
                        await quickmongo.set(`messagePurge-${message.guild.id}`);
                        return message.channel.send('Message Purge logs have been **ENABLED**');
                    } else return message.channel.send('Message Purge logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`messagePurge-${message.guild.id}`) === true) {
                        await quickmongo.delete(`messagePurge-${message.guild.id}`);
                        return message.channel.send('Message Purge logs have been **DISABLED.**');
                    } else return message.channel.send('Message Purge logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'messageDelete') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`messageDelete-${message.guild.id}`) === null) {
                        await quickmongo.set(`messageDelete-${message.guild.id}`, true);
                        return message.channel.send('Message Delete logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`messageDelete-${message.guild.id}`) === false) {
                        await quickmongo.set(`messageDelete-${message.guild.id}`);
                        return message.channel.send('Message Delete logs have been **ENABLED**');
                    } else return message.channel.send('Message Delete logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`messageDelete-${message.guild.id}`) === true) {
                        await quickmongo.delete(`messageDelete-${message.guild.id}`);
                        return message.channel.send('Message Delete logs have been **DISABLED.**');
                    } else return message.channel.send('Message Delete logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'messageEdit') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`messageEdit-${message.guild.id}`) === null) {
                        await quickmongo.set(`messageEdit-${message.guild.id}`, true);
                        return message.channel.send('Message Edit logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`messageEdit-${message.guild.id}`) === false) {
                        await quickmongo.set(`messageEdit-${message.guild.id}`);
                        return message.channel.send('Message Edit logs have been **ENABLED**');
                    } else return message.channel.send('Message Edit logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`messageEdit-${message.guild.id}`) === true) {
                        await quickmongo.delete(`messageEdit-${message.guild.id}`);
                        return message.channel.send('Message Edit logs have been **DISABLED.**');
                    } else return message.channel.send('Message Edit logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'memberKick') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`memberKick-${message.guild.id}`) === null) {
                        await quickmongo.set(`memberKick-${message.guild.id}`, true);
                        return message.channel.send('Member Kick logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`memberKick-${message.guild.id}`) === false) {
                        await quickmongo.set(`memberKick-${message.guild.id}`);
                        return message.channel.send('Member Kick logs have been **ENABLED**');
                    } else return message.channel.send('Member Kick logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`memberKick-${message.guild.id}`) === true) {
                        await quickmongo.delete(`memberKick-${message.guild.id}`);
                        return message.channel.send('Member Kick logs have been **DISABLED.**');
                    } else return message.channel.send('Member Kick logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'memberBan') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`memberBan-${message.guild.id}`) === null) {
                        await quickmongo.set(`memberBan-${message.guild.id}`, true);
                        return message.channel.send('Member Ban logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`memberBan-${message.guild.id}`) === false) {
                        await quickmongo.set(`memberBan-${message.guild.id}`);
                        return message.channel.send('Member Ban logs have been **ENABLED**');
                    } else return message.channel.send('Member Ban logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`memberBan-${message.guild.id}`) === true) {
                        await quickmongo.delete(`memberBan-${message.guild.id}`);
                        return message.channel.send('Member Ban logs have been **DISABLED.**');
                    } else return message.channel.send('Member Ban logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'prefixChange') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`prefixChange-${message.guild.id}`) === null) {
                        await quickmongo.set(`prefixChange-${message.guild.id}`, true);
                        return message.channel.send('Prefix Change logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`prefixChange-${message.guild.id}`) === false) {
                        await quickmongo.set(`prefixChange-${message.guild.id}`);
                        return message.channel.send('Prefix Change logs have been **ENABLED**');
                    } else return message.channel.send('Prefix Change logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`prefixChange-${message.guild.id}`) === true) {
                        await quickmongo.delete(`prefixChange-${message.guild.id}`);
                        return message.channel.send('Prefix Change logs have been **DISABLED.**');
                    } else return message.channel.send('Prefix Change logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'mute') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`mutelogs-${message.guild.id}`) === null) {
                        await quickmongo.set(`mutelogs-${message.guild.id}`, true);
                        return message.channel.send('Mute logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`mutelogs-${message.guild.id}`) === false) {
                        await quickmongo.set(`mutelogs-${message.guild.id}`);
                        return message.channel.send('Mute logs have been **ENABLED**');
                    } else return message.channel.send('Mute logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`mutelogs-${message.guild.id}`) === true) {
                        await quickmongo.delete(`mutelogs-${message.guild.id}`);
                        return message.channel.send('Mute logs have been **DISABLED.**');
                    } else return message.channel.send('Mute logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'warn') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`warnlogs-${message.guild.id}`) === null) {
                        await quickmongo.set(`warnlogs-${message.guild.id}`, true);
                        return message.channel.send('Warn logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`warnlogs-${message.guild.id}`) === false) {
                        await quickmongo.set(`warnlogs-${message.guild.id}`);
                        return message.channel.send('Warn logs have been **ENABLED**');
                    } else return message.channel.send('Warn logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`warnlogs-${message.guild.id}`) === true) {
                        await quickmongo.delete(`warnlogs-${message.guild.id}`);
                        return message.channel.send('Warn logs have been **DISABLED.**');
                    } else return message.channel.send('Warn logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'anticurse') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`aclogs-${message.guild.id}`) === null) {
                        await quickmongo.set(`aclogs-${message.guild.id}`, true);
                        return message.channel.send('Anticurse logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`aclogs-${message.guild.id}`) === false) {
                        await quickmongo.set(`aclogs-${message.guild.id}`);
                        return message.channel.send('Anticurse logs have been **ENABLED**');
                    } else return message.channel.send('Anticurse logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`aclogs-${message.guild.id}`) === true) {
                        await quickmongo.delete(`aclogs-${message.guild.id}`);
                        return message.channel.send('Anticurse logs have been **DISABLED.**');
                    } else return message.channel.send('Anticurse logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'antilink') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`allogs-${message.guild.id}`) === null) {
                        await quickmongo.set(`allogs-${message.guild.id}`, true);
                        return message.channel.send('Antilink logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`allogs-${message.guild.id}`) === false) {
                        await quickmongo.set(`allogs-${message.guild.id}`);
                        return message.channel.send('Antilink logs have been **ENABLED**');
                    } else return message.channel.send('Antilink logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`allogs-${message.guild.id}`) === true) {
                        await quickmongo.delete(`allogs-${message.guild.id}`);
                        return message.channel.send('Antilink logs have been **DISABLED.**');
                    } else return message.channel.send('Antilink logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'altKick') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`altKickLogs-${message.guild.id}`) === null) {
                        await quickmongo.set(`altKickLogs-${message.guild.id}`, true);
                        return message.channel.send('Alt Kick logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`altKickLogs-${message.guild.id}`) === false) {
                        await quickmongo.set(`altKickLogs-${message.guild.id}`);
                        return message.channel.send('Alt Kick logs have been **ENABLED**');
                    } else return message.channel.send('Alt Kick logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`altKickLogs-${message.guild.id}`) === true) {
                        await quickmongo.delete(`altKickLogs-${message.guild.id}`);
                        return message.channel.send('Alt Kick logs have been **DISABLED.**');
                    } else return message.channel.send('Alt Kick logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'channelCreate') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`channelcreate-${message.guild.id}`) === null) {
                        await quickmongo.set(`channelcreate-${message.guild.id}`, true);
                        return message.channel.send('Channel Create logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`channelcreate-${message.guild.id}`) === false) {
                        await quickmongo.set(`channelcreate-${message.guild.id}`);
                        return message.channel.send('Channel Create logs have been **ENABLED**');
                    } else return message.channel.send('Channel Create logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`channelcreate-${message.guild.id}`) === true) {
                        await quickmongo.delete(`channelcreate-${message.guild.id}`);
                        return message.channel.send('Channel Create logs have been **DISABLED.**');
                    } else return message.channel.send('Channel Create logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'channelDelete') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`channeldelete-${message.guild.id}`) === null) {
                        await quickmongo.set(`channeldelete-${message.guild.id}`, true);
                        return message.channel.send('Channel Delete logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`channeldelete-${message.guild.id}`) === false) {
                        await quickmongo.set(`channeldelete-${message.guild.id}`);
                        return message.channel.send('Channel Delete logs have been **ENABLED**');
                    } else return message.channel.send('Channel Delete logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`channeldelete-${message.guild.id}`) === true) {
                        await quickmongo.delete(`channeldelete-${message.guild.id}`);
                        return message.channel.send('Channel Delete logs have been **DISABLED.**');
                    } else return message.channel.send('Channel Delete logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'roleCreate') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`rolecreate-${message.guild.id}`) === null) {
                        await quickmongo.set(`rolecreate-${message.guild.id}`, true);
                        return message.channel.send('Role Create logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`rolecreate-${message.guild.id}`) === false) {
                        await quickmongo.set(`rolecreate-${message.guild.id}`);
                        return message.channel.send('Role Create logs have been **ENABLED**');
                    } else return message.channel.send('Role Create logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`rolecreate-${message.guild.id}`) === true) {
                        await quickmongo.delete(`rolecreate-${message.guild.id}`);
                        return message.channel.send('Role Create logs have been **DISABLED.**');
                    } else return message.channel.send('Role Create logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }

            if (query === 'roleDelete') {
                let logsChoice = args[2];
                if (logsChoice === 'enable') {
                    if (await quickmongo.fetch(`roledelete-${message.guild.id}`) === null) {
                        await quickmongo.set(`roledelete-${message.guild.id}`, true);
                        return message.channel.send('Role Delete logs have been **ENABLED.**');
                    } else if (await quickmongo.fetch(`roledelete-${message.guild.id}`) === false) {
                        await quickmongo.set(`roledelete-${message.guild.id}`);
                        return message.channel.send('Role Delete logs have been **ENABLED**');
                    } else return message.channel.send('Role Delete logs have **ALREADY BEEN ENABLED.**');
                } else if (logsChoice === 'disable') {
                    if (await quickmongo.fetch(`roledelete-${message.guild.id}`) === true) {
                        await quickmongo.delete(`roledelete-${message.guild.id}`);
                        return message.channel.send('Role Delete logs have been **DISABLED.**');
                    } else return message.channel.send('Role Delete logs have **ALREADY BEEN DISABLED.**');
                } else return message.channel.send('Please choose from \`enable\` or \`disable.\`');
            }
        }

        if (choice === 'altKick') {
            const query = args[1];

            if (query === 'enable') {
                if (await quickmongo.fetch(`altKick-${message.guild.id}`) === null) {
                    await quickmongo.set(`altKick-${message.guild.id}`, true);
                    return message.channel.send('Alt Kick has been **ENABLED**.');
                } else if (await quickmongo.fetch(`altKick-${message.guild.id}`) === false) {
                    await quickmongo.set(`altKick-${message.guild.id}`, true);
                    return message.channel.send('Alt Kick has been **ENABLED.**');
                } else return message.channel.send('Alt Kick has **ALREADY BEEN ENABLED.**');
            } else if (query === 'disable') {
                if (await quickmongo.fetch(`altKick-${message.guild.id}`) === true) {
                    await quickmongo.delete(`altKick-${message.guild.id}`);
                    return message.channel.send('Alt Kick has been **DISABLED.**');
                } else return message.channel.send('Alt Kick has **ALREADY BEEN DISABLED.**');
            } else return message.channel.send('Please choose from \`enable\` or \`disable\`.');
        }

        if (choice === 'antiSpam') {
            const query = args[1];

            if (query === 'enable') {
                if (await quickmongo.fetch(`as-${message.guild.id}`) === null) {
                    await quickmongo.set(`as-${message.guild.id}`, true);
                    return message.channel.send('Anti Spam has been **ENABLED**.');
                } else if (await quickmongo.fetch(`as-${message.guild.id}`) === false) {
                    await quickmongo.set(`as-${message.guild.id}`, true);
                    return message.channel.send('Anti Spam had been **ENABLED.**');
                } else return message.channel.send('Anti Spam has **ALREADY BEEN ENABLED.**');
            } else if (query === 'disable') {
                if (await quickmongo.fetch(`as-${message.guild.id}`) === true) {
                    await quickmongo.delete(`as-${message.guild.id}`);
                    return message.channel.send('Anti Spam has been **DISABLED.**');
                } else return message.channel.send('Anti Spam has **ALREADY BEEN DISABLED.**');
            } else return message.channel.send('Please choose from \`enable\` or \`disable\`.');
        }

        if (choice === 'memberRole') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`memberrole-${message.guild.id}`);
                message.channel.send('**Member Role** has been reset.');
            } else {
                const memberRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

                if (!memberRole) return message.channel.send('Please specify a valid member role.');

                await quickmongo.set(`memberrole-${message.guild.id}`, memberRole.id);

                message.channel.send(`You have set ${memberRole} as your member role.`);
            }
        }

        if (choice === 'mutedRole') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`muterole-${message.guild.id}`);
                message.channel.send('**Muted Role** has been reset.');
            } else {
                const muteRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

                if (!muteRole) return message.channel.send('Please specify a valid member role.');

                await quickmongo.set(`muterole-${message.guild.id}`, muteRole.id);

                message.channel.send(`You have set ${muteRole} as your muted role.`);
            }
        }

        if (choice === 'modRole') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`modrole-${message.guild.id}`);
                message.channel.send('**Mod Role** has been reset.');
            } else {
                const modRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

                if (!modRole) return message.channel.send('Please specify a valid mod role.');

                await quickmongo.set(`modrole-${message.guild.id}`, modRole.id);

                message.channel.send(`You have set ${modRole} as your mod role.\n**NOTE:** mods can kick, mute and ban members.`);
            }
        }

        if (choice === 'staffRole') {
            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`staffrole-${message.guild.id}`);
                message.channel.send('**Staff Role** has been reset.');
            } else {
                const staffRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

                if (!staffRole) return message.channel.send('Please specify a valid staff role.');

                await quickmongo.set(`staffrole-${message.guild.id}`, staffRole.id);

                message.channel.send(`You have set ${staffRole} as your staff role.\n**NOTE:** staff can only mute and kick members.`);
            }
        }

        if (choice === 'autoRole') {
            const query = args[1];

            if (!query) return message.channel.send('Please choose from \`enable\` or \`disable\`.');

            if (!memberRoleCheck) return message.channel.send('Please setup **Member Role** before using autorole.');

            if (query === 'enable') {
                if (await quickmongo.fetch(`autorole-${message.guild.id}`) === null) {
                    await quickmongo.set(`autorole-${message.guild.id}`, true);
                    return message.channel.send('Autorole has been **ENABLED**.');
                } else if (await quickmongo.fetch(`autorole-${message.guild.id}`) === false) {
                    await quickmongo.set(`autorole-${message.guild.id}`, true);
                    return message.channel.send('Autorole has been **ENABLED.**');
                } else return message.channel.send('Autorole has **ALREADY BEEN ENABLED.**');
            }

            if (query === 'disable') {
                if (await quickmongo.fetch(`autorole-${message.guild.id}`) === true) {
                    await quickmongo.delete(`autorole-${message.guild.id}`);
                    return message.channel.send('Autorole has been **DISABLED.**');
                } else return message.channel.send('Autorole has **ALREADY BEEN DISABLED.**');
            }
        }

        if (choice === 'levels') {
            let query = args[1];

            if (!query) return message.channel.send('Please chooce from \`enable\` or \`disable\`.');

            if (query === 'enable') {
                if (await quickmongo.fetch(`levels-${message.guild.id}`) === null) {
                    await quickmongo.set(`levels-${message.guild.id}`, true);
                    return message.channel.send('Levels have been **ENABLED.**');
                } else if (await quickmongo.fetch(`levels-${message.guild.id}`) === false) {
                    await quickmongo.set(`levels-${message.guild.id}`);
                    return message.channel.send('Levels have been **ENABLED.**');
                } else return message.channel.send('Levels have **ALREADY BEEN ENABLED.**')
            }

            if (query === 'disable') {
                if (await quickmongo.fetch(`levels-${message.guild.id}`) === true) {
                    await quickmongo.delete(`levels-${message.guild.id}`);
                    return message.channel.send('Levels have been **DISABLED.**');
                } else return message.channel.send('Levels have **ALREADY BEEN DISABLED.**');
            }
        }

        if (choice === 'levelupChannel') {
            const levelupChannel = message.mentions.channels.first();

            if (args[1] === 'reset' || args[1] === 'none') {
                await quickmongo.delete(`levelup-${message.guild.id}`);
                return message.channel.send('**Levelup Channel** has been reset.');
            }

            if (!levelupChannel) return message.channel.send('Please specify a valid channel.');

            await quickmongo.set(`levelup-${message.guild.id}`, levelupChannel.id);

            message.channel.send(`You have set ${levelupChannel} as your levelup channel.`);
        }

        if (choice === 'config') {
            const configEmbed = new Discord.MessageEmbed()
                .setColor('WHITE')
                .setTitle(`${message.guild.name}'s Server Configuration`)
                .addField('Usage', `${prefix}setup <section> [value]\nTo reset a value, simply use \`none\` or \`reset\`.\nTo get a section name, use ${prefix}setup.\n\n**NOTE:** Use ${prefix}setup help <section-name> for help with any section.`)
                .addField(`\u200B`, '__General__')
                .addField('👋 Welcome Channel', `${welcomeChannelStatus}`, true)
                .addField('🚶‍♂️ Goodbye Channel', `${leaveChannelStatus}`, true)
                .addField('🌐 Autorole', `\`${autoRoleStatus}\``, true)
                .addField(`\u200B`, '__Moderation__')
                .addField('🔨 Logs Channel', `${logsChannelStatus}`, true)
                .addField('🛠️ Logs', `\`${logsStatus}\``, true)
                .addField('🧑 Member Role', `${memberRoleStatus}`, true)
                .addField('⛔ Mute Role', `${muteRoleStatus}`, true)
                .addField('⛔ Mod Role', `${modRoleStatus}`, true)
                .addField('⛔ Staff Role', `${staffRoleStatus}`, true)
                .addField('🤬 Anticurse', `\`${anticurseStatus}\``, true)
                .addField(`❌ Antilink`, `\`${antilinkStatus}\``, true)
                .addField('🦿 Alt Kick', `\`${altKickStatus}\``, true)
                .addField(`\u200B`, '__Features__')
                .addField('❌ Anti Spam', `\`${antiSpamStatus}\``, true)
                .addField('📋 Levels', `\`${levelsStatus}\``, true)
                .addField('🚀 Levelup Channel', `${levelupChannelStatus}`, true);

            message.channel.send(configEmbed);
        }
    }
}