const { MessageCollector, MessageEmbed } = require('discord.js');
const prefixModel = require('../../models/prefix');

module.exports = {
    name: 'trivia',
    aliases: '',
    cooldown: 2,
    permissions: [],
    usage: ".trivia",
    description: "Plays a trivia game.",
    async execute(message, args, client, Discord) {

        const data = await prefixModel.findOne({
            GuildID: message.guild.id
        })
        const prefix = data.Prefix;

        let category = args[0];
        let finished = false;
        if (!category) return message.channel.send(
            new MessageEmbed()
                .setTitle('Niron Trivia')
                .setColor('RANDOM')
                .setDescription(`To play the game, use \`${prefix}trivia [category]\`\nTo suggest a category / question, use \`${prefix}trivia suggest\`\n\n**Categories:**\n
                \`Animals\`, \`Automotive\`, \`Aviation\`, \`Baseball\`, \`Canada\`, \`Chemistry\`, \`China\`, 
                \`Computers\`, \`Disney\`, \`History\`, \`Hockey\`, \`Literature\`, \`Math\`, \`Military\`,\n
                **In Progress:**\n
                \`Movie\`, \`Music\`, \`Political\`, \`Science\`, \`Space\`, \`Sports\`
                Feel free to suggest categories and/or questions using ${prefix}trivia suggest !

                `)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
        );

        if (category === 'suggest') {
            const channel = client.channels.cache.get('868885745761415188');
            const split = message.content.slice(prefix.length + 14);

            if (!split) return message.channel.send('You must provide a suggestion.');

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle('New Trivia Suggestion!')
                .addField('Author', message.author.toString(), true)
                .addField('Guild', message.guild.name, true)
                .addField('Report', split)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            channel.send(reportEmbed);
            message.channel.send('**Trivia suggestion has been sent!**');
        }

        else if (category === 'Animals' || category === 'animals') {
            let questions = [
                {
                    title: 'Believed to grow as large as 60 feet (18 meters), what is the largest species of shark currently living in the ocean?',
                    options: ['Great White Shark', 'Whale Shark', 'Beluga Whale', 'Orca'],
                    answer: 'Whale Shark',
                    correct: 2
                },
                {
                    title: 'Which marine animal is the only known natural predator of the great white shark?',
                    options: ['Salmon', 'Polar Bear', 'Orca', 'Octopus'],
                    answer: 'Orca',
                    correct: 3
                },
                {
                    title: 'Which bird has eyes that are larger than its brain?',
                    options: ['Elephant', 'Dog', 'Flamingo', 'Ostrich'],
                    answer: 'Ostrich',
                    correct: 4
                },
                {
                    title: 'What is the only mammal born with horns?',
                    options: ['Giraffe', 'Tiger', 'Elephant', 'Zebra'],
                    answer: 'Giraffe',
                    correct: 1
                },
                {
                    title: 'What flightless bird is featured on New Zealand’s one dollar coin?',
                    options: ['Dove', 'Penguin', 'Kiwi', 'Ostrich'],
                    answer: 'Kiwi',
                    correct: 3
                },
                {
                    title: 'The aardvark is native to which continent?',
                    options: ['Antarctica', 'Africa', 'Europe', 'South America'],
                    answer: 'Africa',
                    correct: 2
                },
                {
                    title: 'What is the only mammal that can truly fly?',
                    options: ['Dove', 'Bat', 'Penguin', 'Leopard'],
                    answer: 'Bat',
                    correct: 2
                },
                {
                    title: 'The dingo is a type of feral dog native to which country?',
                    options: ['Australia', 'Greece', 'Canada', 'Italy'],
                    answer: 'Australia',
                    correct: 1
                },
                {
                    title: 'What is the largest rodent found in North America?',
                    options: ['Raccoon', 'Squirrel', 'Rat', 'Beaver'],
                    answer: 'Beaver',
                    correct: 4
                },
                {
                    title: 'What is the only bird known to fly backwards?',
                    options: ['Pelican', 'Bat', 'Hummingbird', 'Woodpecker'],
                    answer: 'Hummingbird',
                    correct: 3
                },
                {
                    title: 'What is largest living bird by wingspan?',
                    options: ['Wandering Albatross', 'American Robin', 'Red-billed Quelea', 'Domestic Chicken'],
                    answer: 'Wandering Albatross',
                    correct: 1
                },
                {
                    title: 'What breed of horse is best known for its use in racing?',
                    options: ['Standard', 'Inbred', 'Grey', 'Thoroughbred'],
                    answer: 'Thoroughbred',
                    correct: 4
                },
                {
                    title: 'What is the name for a dog created by crossing a Labrador Retriever and a Poodle?',
                    options: ['Golden Retriever', 'Labradoodle', 'Husky', 'Beagle'],
                    answer: 'Labradoodle',
                    correct: 2
                },
                {
                    title: 'What is the name for the offspring of a male donkey and a female horse?',
                    options: ['Donkita', 'Tiger', 'Mule', 'Chevrolet'],
                    answer: 'Mule',
                    correct: 3
                },
                {
                    title: 'The llama is a domesticated camelid that is native to which continent?',
                    options: ['South America', 'North America', 'Africa', 'Asia'],
                    answer: 'South America',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Animal Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Automotive' || category === 'automotive') {
            let questions = [
                {
                    title: 'The Ford Mustang was introduced the public at at the New York World’s Fair in what year?',
                    options: ['1970', '1964', '1988', '1912'],
                    answer: '1964',
                    correct: 2
                },
                {
                    title: 'In 1998, the German automobile company Daimler-Benz purchased what U.S. car company?',
                    options: ['BMW', 'Volkswagen', 'Chrysler', 'Ford'],
                    answer: 'Chrysler',
                    correct: 3
                },
                {
                    title: 'Saab was an automobile manufacturer founded in what country in 1945?',
                    options: ['India', 'Germany', 'Russia', 'Sweden'],
                    answer: 'Sweden',
                    correct: 4
                },
                {
                    title: 'What luxury car company introduced the Boxster roadster in 1996?',
                    options: ['Porsche', 'Audi', 'BMW', 'Cadillac'],
                    answer: 'Porsche',
                    correct: 1
                },
                {
                    title: 'What is the English translation for the name of the German automaker Volkswagen?',
                    options: ['German Engineering', 'Fast Car', 'People’s Car', 'Slick Car'],
                    answer: 'People’s Car',
                    correct: 3
                },
                {
                    title: 'What does the acronym for the German multinational company BMW stand for? (English)',
                    options: ['Botvian Motor Works', 'Bavarian Motor Works', 'Belgium Motor Works', 'Belarus Motor Works'],
                    answer: 'Bavarian Motor Works',
                    correct: 2
                },
                {
                    title: 'General Motors was founded in which city?',
                    options: ['Vegas', 'Flint', 'Toronto', 'Hong Kong'],
                    answer: 'Flint',
                    correct: 2
                },
                {
                    title: 'What does a tachometer measure, as well as show?',
                    options: ['RPM', 'BPM', 'Speed', 'Tachs'],
                    answer: 'RPM',
                    correct: 1
                },
                {
                    title: 'What is the name for the unit of measurement of power that is roughly equal to 746 watts?',
                    options: ['Current', 'Volts', 'Feet', 'Horsepower'],
                    answer: 'Horsepower',
                    correct: 4
                },
                {
                    title: 'The first generation of the Chevrolet Corvette was introduced in what year?',
                    options: ['1951', '1952', '1953', '1954'],
                    answer: '1953',
                    correct: 3
                },
                {
                    title: 'In most modern vehicles, the carburetor has been replace with what?',
                    options: ['Fuel Injection', 'Shift Lever', 'Steering Wheel', 'Seatbelt'],
                    answer: 'Fuel Injection',
                    correct: 1
                },
                {
                    title: 'Porsche is a brand of car that originated in what country?',
                    options: ['America', 'Italy', 'Canads', 'Germany'],
                    answer: 'Germany',
                    correct: 4
                },
                {
                    title: 'Which of the following is a motorbike line?',
                    options: ['Samurai', 'CBR', 'Wiper', 'Zero'],
                    answer: 'CBR',
                    correct: 2
                },
                {
                    title: 'What characteristic are motorcycles named after?',
                    options: ['Speed', 'Acceleration Time', 'Engine Displacement', 'Number of Cylinders'],
                    answer: 'Engine Displacement',
                    correct: 3
                },
                {
                    title: 'What color is often the high beams light on the dashboard?',
                    options: ['Blue', 'Red', 'Yellow', 'White'],
                    answer: 'Blue',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Automotive Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Aviation' || category === 'aviation') {
            let questions = [
                {
                    title: 'What is the call sign of any United States Marine Corps aircraft carrying the president of the United States?',
                    options: ['Air Strike', 'Marine One', 'Red dot', 'President Inbound'],
                    answer: 'Marine One',
                    correct: 2
                },
                {
                    title: 'In 2003, which U.S. state was officially declared the birthplace of aviation?',
                    options: ['California', 'New York', 'Ohio', 'Oregon'],
                    answer: 'Ohio',
                    correct: 3
                },
                {
                    title: 'What was the nickname for the four engine B-17 bomber planes used during WWII?',
                    options: ['Big Boy', 'T-Bomb', 'Sightline', 'Flying Fortress'],
                    answer: 'Flying Fortress',
                    correct: 4
                },
                {
                    title: 'A Boeing 777 is equipped with how many engines?',
                    options: ['Two', 'Seven', 'One', 'Four'],
                    answer: 'Two',
                    correct: 1
                },
                {
                    title: 'The Concorde was a supersonic passenger airliner flown by which two airlines?',
                    options: ['Air Canada and British Airways', 'Air Canada and Air France', 'Air France and British Airways', 'Delta and United'],
                    answer: 'Air France and British Airways',
                    correct: 3
                },
                {
                    title: 'What is the three letter airport code for the Los Angeles International Airport?',
                    options: ['YYZ', 'LAX', 'BLC', 'LAI'],
                    answer: 'LAX',
                    correct: 2
                },
                {
                    title: 'Which major American airline is named after a Greek letter?',
                    options: ['Beta', 'Deta', 'Alpha', 'Landa'],
                    answer: 'Delta',
                    correct: 2
                },
                {
                    title: 'In 1783, the first free flight of a hot air balloon carrying a human occurred in what city?',
                    options: ['Paris', 'Toronto', 'Venice', 'Las Vegas'],
                    answer: 'Paris',
                    correct: 1
                },
                {
                    title: 'Who was the first person selected as Time Magazine’s Man of the Year?',
                    options: ['Nathaniel Smithson', 'Boris Johnson', 'Isaac Newton', 'Charles Lindbergh'],
                    answer: 'Charles Lindbergh',
                    correct: 4
                },
                {
                    title: 'Who was the first woman pilot to fly solo across the Atlantic?',
                    options: ['Roberta Bondar', 'Michelle Obama', 'Amelia Earhart', 'Kylie Jenner'],
                    answer: 'Amelia Earhart',
                    correct: 3
                },
                {
                    title: 'What was the nickname for the Hughes H-4 Hercules aircraft that made a single flight in 1947?',
                    options: ['Spruce Goose', 'Birch Bird', 'Red Robin', 'Sky Writer'],
                    answer: 'Spruce Goose',
                    correct: 1
                }
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Aviation Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Baseball' || category === 'baseball') {
            let questions = [
                {
                    title: 'In baseball, what is the term for a player that is in the batting order to hit only but not play defense?',
                    options: ['RF', 'DH', '2B', 'Pitcher'],
                    answer: 'DH',
                    correct: 2
                },
                {
                    title: 'What is the only Major League Baseball team to never make it to the World Series?',
                    options: ['Los Angeles Angels', 'Houston Astros', 'Seattle Mariners', 'Toronto Blue Jays'],
                    answer: 'Seattle Mariners',
                    correct: 3
                },
                {
                    title: 'Which two baseball teams played in the 2000 World Series, sometimes called the “Subway Series”?',
                    options: ['Orioles and Rays', 'Red Sox and White Sox', 'Brewers and White Sox', 'Yankees and Mets'],
                    answer: 'Yankees and Mets',
                    correct: 4
                },
                {
                    title: 'In baseball and softball what do the initials RBI stand for?',
                    options: ['Runs Batted In', 'Runs Before Innings', 'Resting Batters Infield', 'Runners Beating Innings'],
                    answer: 'Runs Batted In',
                    correct: 1
                },
                {
                    title: 'What is the highest possible batting average?',
                    options: ['1000', '100', '1.000', '.500'],
                    answer: '1.000',
                    correct: 3
                },
                {
                    title: 'What does the statistic BAA stand for?',
                    options: ['Beating All Associations', 'Batting Average Against', 'Batting Against All', 'Batters Averaging Alot'],
                    answer: 'Batting Average Against',
                    correct: 2
                },
                {
                    title: 'Every Major League Baseball team retired uniform number 42 to honor what barrier-breaking player?',
                    options: ['Babe Ruth', 'Jackie Robinson', 'Roberto Alomar', 'Derek Jeter'],
                    answer: 'Jackie Robinson',
                    correct: 2
                },
                {
                    title: 'Who holds the record for the most home runs in a single major league baseball season?',
                    options: ['Barry Bonds', 'Shohei Ohtani', 'Mike Trout', 'Jose Bautista'],
                    answer: 'Barry Bonds',
                    correct: 1
                },
                {
                    title: 'What is the name for the batter waiting to bat?',
                    options: ['Bench', 'Ball Boy', 'Waiter', 'On Deck'],
                    answer: 'On Deck',
                    correct: 4
                },
                {
                    title: 'What team won the World Series in both 1992 & 1993?',
                    options: ['Cincinatti Reds', 'Boston Red Sox', 'Toronto Blue Jays', 'Cleveland Indians'],
                    answer: 'Toronto Blue Jays',
                    correct: 3
                },
                {
                    title: 'Barry Bonds currently holds the Major League Baseball home run record with how many home runs?',
                    options: ['762', '501', '896', '233'],
                    answer: '762',
                    correct: 1
                },
                {
                    title: 'What is the name of Atlanta’s major league baseball team?',
                    options: ['Atlanta Fighters', 'Atlanta Apples', 'Atlanta Canoes', 'Atlanta Braves'],
                    answer: 'Atlanta Braves',
                    correct: 4
                },
                {
                    title: 'What two teams competed in the 2015 American League Championship Series (ALCS)?',
                    options: ['Astros and Padres', 'Royals and Blue Jays', 'Giants and Rays', 'White Sox and Orioles'],
                    answer: 'Royals and Blue Jays',
                    correct: 2
                },
                {
                    title: 'Who was the first pinch hitter to score a home run in World Series play?',
                    options: ['Babe Ruth', 'Derek Jeter', 'Yogi Berra', 'Edwin Encarnacion'],
                    answer: 'Yogi Berra',
                    correct: 3
                },
                {
                    title: 'Who has won the most Cy Young awards in the history of the MLB?',
                    options: ['Roger Clemens', 'Nolan Ryan', 'Chris Sale', 'Robbie Ray'],
                    answer: 'Roger Clemens',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Baseball Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Basketball' || category === 'basketball') {
            let questions = [
                {
                    title: 'At 5 ft 3 in (1.60 m), who was the shortest player ever to play in the National Basketball Association?',
                    options: ['Vince Carter', 'Muggsy Bogues', 'Michael Jordan', 'Larry Bird'],
                    answer: 'Muggsy Bogues',
                    correct: 2
                },
                {
                    title: 'Basketball great Kobe Bryant played his entire 20-year career with which team?',
                    options: ['Pistons', 'Nuggets', 'Lakers', 'Raptors'],
                    answer: 'Lakers',
                    correct: 3
                },
                {
                    title: 'In basketball, what is the term used when a player reaches double digits in three of five statistical categories?',
                    options: ['Single-triple', 'Double-triple', 'Triple-single', 'Triple-double'],
                    answer: 'Triple-double',
                    correct: 4
                },
                {
                    title: 'What now retired NBA player starred in the 1996 movie Kazaam?',
                    options: ['Shaquille O’Neal', 'Michael Jordan', 'Lebron James', 'Kobe Bryant'],
                    answer: 'Shaquille O’Neal',
                    correct: 1
                },
                {
                    title: 'The NBA’s Memphis Grizzlies formerly played in what Canadian city?',
                    options: ['Ottawa', 'Calgary', 'Vancouver', 'Toronto'],
                    answer: 'Vancouver',
                    correct: 3
                },
                {
                    title: 'What NBA player was known as “The Pearl”?',
                    options: ['Kyle Lowry', 'Earl Monroe', 'Paul George', 'Stephen Curry'],
                    answer: 'Earl Monroe',
                    correct: 2
                },
                {
                    title: 'According to NBA rules how long does a player have after catching the ball to shoot a free throw?',
                    options: ['20s', '210s', '5s', '1m'],
                    answer: '10s',
                    correct: 2
                },
                {
                    title: 'What is the regulation height for a basketball hoop?',
                    options: ['10ft', '9ft', '11ft', '5m'],
                    answer: '10ft',
                    correct: 1
                }
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Basketball Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Canada' || category === 'canada') {
            let questions = [
                {
                    title: 'In what major Canadian city would you find the Lord Stanley’s Gift Monument?',
                    options: ['Toronto', 'Ottawa', 'Vancouver', 'Halifax'],
                    answer: 'Ottawa',
                    correct: 2
                },
                {
                    title: 'What is the only Canadian province without a natural border?',
                    options: ['British Columbia', 'Novia Scotia', 'Saskatchewan', 'Yukon'],
                    answer: 'Saskatchewan',
                    correct: 3
                },
                {
                    title: 'The Canadian province of Quebec is bordered to the west by which other province?',
                    options: ['Prince Edwars Island', 'Manitoba', 'Alberta', 'Ontario'],
                    answer: 'Ontario',
                    correct: 4
                },
                {
                    title: 'Originally from Quebec, what food comes from the local french slang word for a “mess”?',
                    options: ['Poutine', 'French Fries', 'Iced Tea', 'Beaver Tails'],
                    answer: 'Poutine',
                    correct: 1
                },
                {
                    title: "What is Canada's national sport?",
                    options: ['Basketball', 'Hockey', 'Lacrosse', 'Racketball'],
                    answer: 'Lacrosse',
                    correct: 3
                },
                {
                    title: 'The Canadian flag features a leaf from which type of tree?',
                    options: ['Oak', 'Maple', 'Pine', 'Fir'],
                    answer: 'Maple',
                    correct: 2
                },
                {
                    title: 'What is the capital city of Canada’s Yukon territory?',
                    options: ['Akinshah', 'Whitehorse', 'Toronto', 'Yellowknife'],
                    answer: 'Whitehorse',
                    correct: 2
                },
                {
                    title: 'What city is the capital of Canada?',
                    options: ['Ottawa', 'Toronto', 'Vancouver', 'Calgary'],
                    answer: 'Ottawa',
                    correct: 1
                },
                {
                    title: 'As of August 2021, who is the Prime Minister of Canada?',
                    options: ['Alexander Bell', 'Pierre Trudeau', 'Stephen Harper', 'Justin Trudeau'],
                    answer: 'Justin Trudeau',
                    correct: 4
                },
                {
                    title: 'Canada’s highest mountain is located in which province or territory?',
                    options: ['Novia Scotia', 'Ontario', 'Yukon', 'British Columbia'],
                    answer: 'Yukon',
                    correct: 3
                },
                {
                    title: 'How many times zones are in Canada?',
                    options: ['Six', 'Seven', 'Eight', 'Nine'],
                    answer: 'Six',
                    correct: 1
                },
                {
                    title: 'Canada is made up of how many provinces?',
                    options: ['3', '4', '8', '10'],
                    answer: '10',
                    correct: 4
                },
                {
                    title: 'In what year did Canada become a country?',
                    options: ['1865', '1867', '1869', '1871'],
                    answer: '1867',
                    correct: 2
                },
                {
                    title: 'What is the only official bilingual province in Canada?',
                    options: ['Ontario', 'Quebec', 'New Brunswick', 'Alberta'],
                    answer: 'New Brunswick',
                    correct: 3
                },
                {
                    title: 'What is the second largest country by land mass?',
                    options: ['Canada', 'China', 'USA', 'Russia'],
                    answer: 'Canada',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Canada Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Chemistry' || category === 'chemistry') {
            let questions = [
                {
                    title: 'On the periodic table, which element has an atomic weight of 1.00794?',
                    options: ['Krypton', 'Hydrogen', 'Barium', 'Neon'],
                    answer: 'Hydrogen',
                    correct: 2
                },
                {
                    title: "In an isotope, which of the following's values change?",
                    options: ['Protons', 'Chromosones', 'Neutrons', 'Electrons'],
                    answer: 'Neutrons',
                    correct: 3
                },
                {
                    title: 'On the Periodic Table of Elements, Hg is the symbol for what element?',
                    options: ['Tin', 'Silver', 'Gold', 'Mercury'],
                    answer: 'Mercury',
                    correct: 4
                },
                {
                    title: 'What is the most abundant chemical element in the Universe?',
                    options: ['Hydrogen', 'Aluminium', 'Nitrogen', 'Helium'],
                    answer: 'Hydrogen',
                    correct: 1
                },
                {
                    title: 'What is the boiling temperature of water?',
                    options: ['120C', '100F', '12C', '130F'],
                    answer: '100C',
                    correct: 3
                },
                {
                    title: 'How many electrons does a hydrogen atom have?',
                    options: ['Two', 'One', 'Three', 'Four'],
                    answer: 'One',
                    correct: 2
                },
                {
                    title: 'Fe is the chemical symbol for what element?',
                    options: ['Gold', 'Iron', 'Ferrous', 'Neon'],
                    answer: 'Iron',
                    correct: 2
                },
                {
                    title: 'Pb is the chemical symbol for what element?',
                    options: ['Lead', 'Uranium', 'Copper', 'Tin'],
                    answer: 'Lead',
                    correct: 1
                },
                {
                    title: 'Sr is the chemical symbol for what element?',
                    options: ['Tin', 'Silver', 'Copper', 'Strontium'],
                    answer: 'Strontium',
                    correct: 4
                },
                {
                    title: 'Sn is the chemical symbol for what element?',
                    options: ['Beryllium', 'Francium', 'Tin', 'Gold'],
                    answer: 'Tin',
                    correct: 3
                },
                {
                    title: 'The filament in an incandescent light bulb is made of what element?',
                    options: ['Tungsten', 'copper', 'Tin', 'Fluorine'],
                    answer: 'Tungsten',
                    correct: 1
                },
                {
                    title: 'Diamonds are made up almost entirely of what element?',
                    options: ['Lead', 'Nitrogen', 'Coal', 'Carbon'],
                    answer: 'Carbon',
                    correct: 4
                },
                {
                    title: 'How many hydrogen atoms are in one molecule of water?',
                    options: ['One', 'Two', 'Three', 'Four'],
                    answer: 'Two',
                    correct: 2
                },
                {
                    title: 'Sodium chloride is most commonly called what?',
                    options: ['Windex', 'Coke', 'Salt', 'Water'],
                    answer: 'Salt',
                    correct: 3
                },
                {
                    title: 'Who is generally acknowledged as the “father” of the modern periodic table?',
                    options: ['Dmitri Mendeleev', 'Isaac Newton', 'Nick Bohr', 'Alexander Graham Bell'],
                    answer: 'Dmitri Mendeleev',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Chemistry Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'China' || category === 'china') {
            let questions = [
                {
                    title: 'China’s Terracotta Army depicts the soldiers of what emperor?',
                    options: ['Zao Li', 'Qin Shi Huang', 'Josn Xi', 'Kim Jong Un'],
                    answer: 'Qin Shi Huang',
                    correct: 2
                },
                {
                    title: 'In China, what number is considered unlucky because its pronunciation is similar to that for the word “death”?',
                    options: ['Seven', 'Eight', 'Four', 'Three'],
                    answer: 'Four',
                    correct: 3
                },
                {
                    title: 'What is the color of the five stars found on the flag of China?',
                    options: ['Orange', 'Black', 'White', 'Yellow'],
                    answer: 'Yellow',
                    correct: 4
                },
                {
                    title: 'What city is the capital of China?',
                    options: ['Beijing', 'Hong Kong', 'Shanghai', 'Wuhan'],
                    answer: 'Beijing',
                    correct: 1
                },
                {
                    title: 'What is the main dialect of Chinese spoken in Hong Kong by the majority of the locals?',
                    options: ['Chinese', 'Japanese', 'Cantonese', 'Mandarin'],
                    answer: 'Cantonese',
                    correct: 3
                },
                {
                    title: 'How do you say hello in Mandarin Chinese?',
                    options: ['Hola', 'Ni Hao', 'Jambo', 'Hey'],
                    answer: 'Ni Hao',
                    correct: 2
                },
                {
                    title: 'Which is the most widely spoken language in the world?',
                    options: ['English', 'Mandarin', 'Spanish', 'Swahili'],
                    answer: 'Mandarin',
                    correct: 2
                },
                {
                    title: "How long is China's land border?",
                    options: ['13,743 miles', '14,295 miles', '10,000 miles', '27,273 miles'],
                    answer: '13,743 miles',
                    correct: 1
                },
                {
                    title: 'The martial art of kung fu originated in which country?',
                    options: ['England', 'Japan', 'Korea', 'China'],
                    answer: 'China',
                    correct: 4
                }
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('China Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Computers' || category === 'computers') {
            let questions = [
                {
                    title: 'When referring to a website’s address was does the acronym URL stand for?',
                    options: ['Ultra Radiating Land', 'Uniform Resource Locator', 'Under Radium Location', 'United Random Locator'],
                    answer: 'Uniform Resource Locator',
                    correct: 2
                },
                {
                    title: 'In computer terminology what does the acronym LAN stand for?',
                    options: ['Lesser-area Never', 'Latter-area Newer', 'Local-area Network', 'Lateral-area Neglegence'],
                    answer: 'Local-area Network',
                    correct: 3
                },
                {
                    title: 'What is the only state that can be typed on one row of keys on a QWERTY keyboard?',
                    options: ['Ohio', 'Hawaii', 'Georgia', 'Alaska'],
                    answer: 'Alaska',
                    correct: 4
                },
                {
                    title: 'When browsing the internet, what does the acronym www stand for?',
                    options: ['World-wide Web', 'Weakening weather Web', 'Whenever willing Web', 'World-wide Webster'],
                    answer: 'World-wide web',
                    correct: 1
                },
                {
                    title: 'A modulator-demodulator is a hardware device better known as what?',
                    options: ['Fan', 'SSD', 'Modem', 'Mouse'],
                    answer: 'Modem',
                    correct: 3
                },
                {
                    title: 'What was the first publicly traded U.S. company to reach a $1 trillion market cap?',
                    options: ['Google', 'Apple', 'LG', 'Amazon'],
                    answer: 'Apple',
                    correct: 2
                },
                {
                    title: 'On which popular website do users send tweets?',
                    options: ['Instagram', 'Twitter', 'Discord', 'Reddit'],
                    answer: 'Twitter',
                    correct: 2
                },
                {
                    title: 'Mark Zuckerberg was one of the founders of which social networking site?',
                    options: ['Facebook', 'Snapchat', 'Whatsapp', 'Discord'],
                    answer: 'Facebook',
                    correct: 1
                },
                {
                    title: 'Created in 2009, what was the first decentralized cryptocurrency?',
                    options: ['NFT', 'Dogecoin', 'Paypal', 'Bitcoin'],
                    answer: 'Bitcoin',
                    correct: 4
                },
                {
                    title: 'What do you call the small image icons used to express emotions or ideas in digital communication?',
                    options: ['Image', 'Video', 'Emoji', 'Preview'],
                    answer: 'Emoji',
                    correct: 3
                },
                {
                    title: "If a file's name ends with .mp4, what file type is this?",
                    options: ['Video', 'Image', 'Gif', 'Sound'],
                    answer: 'Video',
                    correct: 1
                },
                {
                    title: 'In 1975 an engineer created the first electronic camera while working for what company?',
                    options: ['Apple', 'Henry', 'Canon', 'Kodak'],
                    answer: 'Kodak',
                    correct: 4
                },
                {
                    title: 'Nintendo is a consumer electronics and video game company founded in what country?',
                    options: ['Canada', 'Japan', 'USA', 'India'],
                    answer: 'Japan',
                    correct: 2
                },
                {
                    title: 'HTML and CSS are computer languages used to create what?',
                    options: ['Discord Bots', 'Phone Bots', 'Websites', 'Video Games'],
                    answer: 'Websites',
                    correct: 3
                },
                {
                    title: 'The first person shooter video game Doom was first released in what year?',
                    options: ['1993', '1994', '1995', '1996'],
                    answer: '1993',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Computers Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Disney' || category === 'disney') {
            let questions = [
                {
                    title: 'What animal was the Sheriff of Nottingham in Disney’s Robin Hood?',
                    options: ['White Wolf', 'Gray Wolf', 'Red Wolf', 'Black Wolf'],
                    answer: 'Gray Wolf',
                    correct: 2
                },
                {
                    title: 'Released in 1941, what is the only Disney animated feature film with a title character that never speaks?',
                    options: ['Robinhood', 'Lilo and Stitch', 'Dumbo', 'Bambi'],
                    answer: 'Dumbo',
                    correct: 3
                },
                {
                    title: 'The Haunted Mansion at Disneyland is home to how many “happy haunts”?',
                    options: ['123', '456', '685', '999'],
                    answer: '999',
                    correct: 4
                },
                {
                    title: 'In the Walt Disney film Pinocchio, what is the name of the giant whale?',
                    options: ['Monstro', 'Bluey', 'Orca', 'Whalesome'],
                    answer: 'Monstro',
                    correct: 1
                },
                {
                    title: 'Which is the only Disney Princess that has a child?',
                    options: ['Rapunzel', 'Aurora', 'Ariel', 'Cinderella'],
                    answer: 'Ariel',
                    correct: 3
                },
                {
                    title: 'What was Walt Disney’s middle name?',
                    options: ['Walt', 'Elias', 'Jimmy', 'James'],
                    answer: 'Elias',
                    correct: 2
                },
                {
                    title: 'What is the first “themed land” just inside the main entrance of Disneyland?',
                    options: ['Bourbon Street USA', 'Main Street USA', 'Parliament Street CAN', 'Tulip Street CAD'],
                    answer: 'Main Street USA',
                    correct: 2
                },
                {
                    title: 'In Disney’s 1959 animated film Sleeping Beauty, who is Princess Aurora is betrothed to?',
                    options: ['Prince Philip', 'Prince James', 'Prince Jack', 'Prince Harry'],
                    answer: 'Prince Philip',
                    correct: 1
                },
                {
                    title: 'What is the name of the Disney cartoon character that is the girlfriend to Donald Duck?',
                    options: ['Alison Duck', 'Betty Duck', 'Rebecca Duck', 'Daisy Duck'],
                    answer: 'Daisy Duck',
                    correct: 4
                },
                {
                    title: 'What was the first ever series to air on the Disney Channel?',
                    options: ['Robinhood', 'Beauty and the Beast', 'Good Morning, Mickey', 'Lilo and Stitch'],
                    answer: 'Good Morning, Mickey',
                    correct: 3
                },
                {
                    title: 'What is the name of Mickey Mouse´s dog?',
                    options: ['Pluto', 'Donny', 'Sparky', 'James'],
                    answer: 'Pluto',
                    correct: 1
                },
                {
                    title: 'In which US city was Walt Disney born?',
                    options: ['Washington', 'New York', 'San Jose', 'Chicago'],
                    answer: 'Chicago',
                    correct: 4
                },
                {
                    title: 'In the movie “The Lion King”, what was Simba’s mother’s name?',
                    options: ['Abu', 'Sarabi', 'Ali', 'Sarah'],
                    answer: 'Sarabi',
                    correct: 2
                }
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Disney Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'History' || category === 'history') {
            let questions = [
                {
                    title: 'When did World War I begin?',
                    options: ['1920', '1914', '1919', '1927'],
                    answer: '1914',
                    correct: 2
                },
                {
                    title: 'When did World War II begin?',
                    options: ['1937', '1938', '1939', '1940'],
                    answer: '1939',
                    correct: 3
                },
                {
                    title: 'Which country was invaded to begin the Second World War?',
                    options: ['Canada', 'Spain', 'Greece', 'Poland'],
                    answer: 'Poland',
                    correct: 4
                },
                {
                    title: 'The Penny-Farthing, also known as a high wheel, was the first machine to be called a what?',
                    options: ['Unicycle', 'Bicycle', 'Motorcycle', 'Beetle'],
                    answer: 'Bicycle',
                    correct: 2
                },
                {
                    title: 'Born into a family of Dutch Americans, who was the only US President to speak English as a second language?',
                    options: ['George W. Bush', 'Abraham Lincoln', 'Martin Van Buren', 'George Washington'],
                    answer: 'Martin Van Buren',
                    correct: 3
                },
                {
                    title: 'Sappho was an Archaic Greek poet from which Greek island?',
                    options: ['Rhodes', 'Euboea', 'Crete', 'Lesbos'],
                    answer: 'Lesbos',
                    correct: 4
                },
                {
                    title: 'The Hershey Company, commonly known as Hershey, was founded in which U.S. state?',
                    options: ['Pennsylvania', 'Illinois', 'Ohio', 'Florida'],
                    answer: 'Pennsylvania',
                    correct: 1
                },
                {
                    title: 'After the attack on Pearl Harbor, the Americans attacked the Japanese. On August 6, 1945 the Americans dropped the first atomic bomb on what Japanese city?',
                    options: ['Tokyo', 'Osaka', 'Hiroshima', 'Kyoto'],
                    answer: 'Hiroshima',
                    correct: 3
                },
                {
                    title: 'Which of the following wars claimed the lives of the most U.S. soldiers?',
                    options: ['World War I', 'US Civil War', 'World War II', 'US Revolutionary War'],
                    answer: 'US Civil War',
                    correct: 2
                },
                {
                    title: 'The last execution in the Tower of London took place during what war?',
                    options: ['World War I', 'World War II', 'Napoleonic Wars', 'War of the Roses'],
                    answer: 'World War II',
                    correct: 2
                },
                {
                    title: 'How old was the youngest American serviceman in World War II?',
                    options: ['12', '9', '15', '13'],
                    answer: '12',
                    correct: 1
                },
                {
                    title: 'Which of the following was developed during World War I?',
                    options: ['Plastic Surgery', 'Poison Gas', 'Blood Banks', 'All of the Above'],
                    answer: 'All of the Above',
                    correct: 4
                },
                {
                    title: 'What nickname did Thomas Jonathan Jackson earn during the American Civil War?',
                    options: ['Blood-N-Guts', 'Dixie', 'Stonewall', 'Fighting Tom'],
                    answer: 'Stonewall',
                    correct: 3
                },
                {
                    title: 'Which of the following had a nephew that served in the U.S. Navy during World War II?',
                    options: ['Hitler', 'Hirohito', 'Mussolini', 'Stalin'],
                    answer: 'Hitler',
                    correct: 1
                },
                {
                    title: 'What percent of the casualties in World War II were civilians?',
                    options: ['40%', '20%', '80%', '60%'],
                    answer: '60%',
                    correct: 4
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('History Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Hockey' || category === 'hockey') {
            let questions = [
                {
                    title: 'What is the name of the professional ice hockey team based in Toronto, Canada?',
                    options: ['Senators', 'Maple Leafs', 'Ducks', 'Oilers'],
                    answer: 'Maple Leafs',
                    correct: 2
                },
                {
                    title: 'What is the name of the Las Vegas professional ice hockey team that began play in the 2017–18 NHL season?',
                    options: ['Senators', 'Otters', 'Knights', 'Lions'],
                    answer: 'Knights',
                    correct: 3
                },
                {
                    title: 'As of August 2021, what is the most recent team to join the NHL?',
                    options: ['Los Angeles', 'Nashville', 'Chicago', 'Seattle'],
                    answer: 'Seattle',
                    correct: 4
                },
                {
                    title: 'Which of the following was not one of the original six teams in the NHL?',
                    options: ['Canucks', 'Canadiens', 'Maple Leafs', 'Bruins'],
                    answer: 'Canucks',
                    correct: 1
                },
                {
                    title: 'In hockey, how many players from each team are allowed to be on the ice at the same time?',
                    options: ['Seven', 'Eight', 'Six', 'Three'],
                    answer: 'Six',
                    correct: 3
                },
                {
                    title: 'In hockey, how many goals is known as a hat trick?',
                    options: ['Four', 'Three', 'Two', 'Five'],
                    answer: 'Three',
                    correct: 2
                },
                {
                    title: 'Which team won the Stanley Cup in 2020?',
                    options: ['Senators', 'Lightning', 'Canadiens', 'Ducks'],
                    answer: 'Lightning',
                    correct: 2
                },
                {
                    title: 'Which player has the most points of all time?',
                    options: ['Wayne Gretzky', 'Mario Lemieux', 'Maurice Richard', 'Bobby Orr'],
                    answer: 'Wayne Gretzky',
                    correct: 1
                },
                {
                    title: 'Which NHL player is known to have scored 50 goals in 50 games?',
                    options: ['Wayne Gretzky', 'Mario Lemieux', 'Maurice Richard', 'Bobby Orr'],
                    answer: 'Mario Lemieux',
                    correct: 4
                },
                {
                    title: 'Who owns the hardest shot record in NHL history?',
                    options: ['Sidney Crosby', 'Shea Weber', 'Znedo Chara', 'Alex Ovechkin'],
                    answer: 'Znedo Chara',
                    correct: 3
                },
                {
                    title: 'Who is the highest scoring goalie in NHL history?',
                    options: ['Martin Brodeur', 'James Reimer', 'Andre Fleury', 'Patrick Roi'],
                    answer: 'Martin Brodeur',
                    correct: 1
                },
                {
                    title: 'What country do most of the players from NHL belong to?',
                    options: ['USA', 'Finland', 'Sweden', 'Canada'],
                    answer: 'Canada',
                    correct: 4
                },
                {
                    title: 'Who was the first player to sign a million dollar contract in the NHL?',
                    options: ['Sidney Crosby', 'Bobby Orr', 'Maurice Richard', 'Patrick Kane'],
                    answer: 'Bobby Orr',
                    correct: 2
                },
                {
                    title: 'In what city is the Hockey Hall of Fame located?',
                    options: ['Calgary', 'Vancouver', 'Toronto', 'Chicago'],
                    answer: 'Toronto',
                    correct: 3
                },
                {
                    title: 'What is it called when a player crosses the opposite blue line before the puck?',
                    options: ['Offside', 'Icing', 'Penalty', 'Crosschecking'],
                    answer: 'Offside',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Hockey Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })
        }

        else if (category === 'Literature' || category === 'literature') {
            let questions = [
                {
                    title: 'In L. Frank Baum’s original 1900 novel, The Wonderful Wizard of Oz, what color were Dorothy’s shoes?',
                    options: ['Gold', 'Silver', 'Brown', 'Black'],
                    answer: 'Silver',
                    correct: 2
                },
                {
                    title: 'According to Forbes magazine in 2004, who was the first person to become a billionaire by writing books?',
                    options: ['George Orwell', 'Tom Clancy', 'JK Rowling', 'Edgar Allan Poe'],
                    answer: 'JK Rowling',
                    correct: 3
                },
                {
                    title: 'In the American comic strip Little Orphan Annie, what is the name of Annie’s dog?',
                    options: ['Lolly', 'Red', 'Sparky', 'Sandy'],
                    answer: 'Sandy',
                    correct: 4
                },
                {
                    title: 'Catcher in the Rye by J.D. Salinger is a story about the life of what teenage protagonist?',
                    options: ['Holden Caulfield', 'Jonathan Sanders', 'Eddie Bower', 'Nicholas Anderson'],
                    answer: 'Holden Caulfield',
                    correct: 1
                },
                {
                    title: 'Who wrote "The Tell-tale Heart"?',
                    options: ['Shakespeare', 'Jimmy Butler', 'Edgar Allan Poe', 'Joe Rocket'],
                    answer: 'Edgar Allan Poe',
                    correct: 3
                },
                {
                    title: 'What is the name for a compound literary or narrative work that is divided into five parts?',
                    options: ['Five Parter', 'Pentalogy', 'Septalogy', 'Essay'],
                    answer: 'Pentalogy',
                    correct: 2
                },
                {
                    title: 'How many novels make up the Harry Potter series?',
                    options: ['Five', 'Six', 'Seven', 'Eight'],
                    answer: 'Seven',
                    correct: 3
                },
                {
                    title: "When was Stephen King's first novel released?",
                    options: ['1974', '1980', '1963', '2001'],
                    answer: '1974',
                    correct: 1
                },
                {
                    title: 'In what city would you find the Wizard of Oz?',
                    options: ['Venice', 'The City of Oz', 'Rome', 'The Emerald City'],
                    answer: 'The Emerald City',
                    correct: 4
                },
                {
                    title: 'The Hound of the Baskervilles is a crime novel featuring which fictional detective?',
                    options: ['Inspector Gadget', 'Geronimo Stilton', 'Sherlock Holmes', 'Donald J Trump'],
                    answer: 'Sherlock Holmes',
                    correct: 3
                },
                {
                    title: 'What is the secret identity of the fictional superhero Batman?',
                    options: ['Bruce Wayne', 'Clark Kent', 'Peter Parker', 'Tony Stark'],
                    answer: 'Bruce Wayne',
                    correct: 1
                },
                {
                    title: 'A Shakespearean sonnet consists of how many lines?',
                    options: ['Eleven', 'Twelve', 'Thirteen', 'Fourteen'],
                    answer: 'Fourteen',
                    correct: 4
                },
                {
                    title: '“Call me Ishmael” is the opening line from what novel?',
                    options: ['Lord of the Flies', 'Moby Dick', 'Macbeth', 'The Hobbit'],
                    answer: 'Moby Dick',
                    correct: 2
                },
                {
                    title: 'How the Grinch Stole Christmas is a children’s book written by which American author?',
                    options: ['Shakespeare', 'George Orwell', 'Dr Seuss', 'JK Rowling'],
                    answer: 'Dr Seuss',
                    correct: 3
                },
                {
                    title: 'In Shakespeare’s tragedy Romeo and Juliet, what’s Romeo’s last name?',
                    options: ['Montague', 'Johnson', 'Elrauso', 'Butler'],
                    answer: 'Montague',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Literature Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })


        }

        else if (category === 'Math' || category === 'math') {
            let questions = [
                {
                    title: 'Integration is the calculation of what?',
                    options: ['Area Above a Curve', 'Area Under a Curve', 'Area Beside a Curve', 'Area Inside a Curve'],
                    answer: 'Area Under a Curve',
                    correct: 2
                },
                {
                    title: 'Which of the following variables is used in calculating the area of a circle?',
                    options: ['y', 'x', 'r', 'd'],
                    answer: 'r',
                    correct: 3
                },
                {
                    title: 'What is a derivative used to calculate?',
                    options: ['Slope of the Line', 'Slope of the Secant', 'Area of a Curve', 'Slope of the Tangent'],
                    answer: 'Slope of the Tangent',
                    correct: 4
                },
                {
                    title: 'Which of the following values is the closest to Pi?',
                    options: ['22/7', '19/6', '30/11', '84/33'],
                    answer: '22/7',
                    correct: 1
                },
                {
                    title: '5 to the power of 0 equals?',
                    options: ['Two', 'Zero', 'One', 'Three'],
                    answer: 'One',
                    correct: 3
                },
                {
                    title: 'What is the formula for a trapezoid?',
                    options: ['1/2(a)h', '1/2(a+b)h', '1/2(h)', 'h(a+b)'],
                    answer: '1/2(a+b)h',
                    correct: 2
                },
                {
                    title: 'Which of the following curves cross the point (0,1)',
                    options: ['sinx', 'cosx', 'tanx', 'xsinx'],
                    answer: 'cosx',
                    correct: 2
                },
                {
                    title: 'How do you write the number 22 in Roman Numerals?',
                    options: ['XXII', 'XIV', 'IXVI', 'XIVX'],
                    answer: 'XXII',
                    correct: 1
                },
                {
                    title: 'Which of the following is an odd number?',
                    options: ['202', '190', '726', '719'],
                    answer: '719',
                    correct: 4
                },
                {
                    title: 'Which of the following is not an integer?',
                    options: ['18/6', '45/9', '22/7', '20/2'],
                    answer: '22/7',
                    correct: 3
                },
                {
                    title: 'How many turning points does a cubic curve have? (x^3)',
                    options: ['Two', 'Three', 'Four', 'One'],
                    answer: 'Two',
                    correct: 1
                },
                {
                    title: 'What is the name of this sequence? 0, 1, 1, 2, 3, 5, 8, 13, ...?',
                    options: ['20', '19', '35', '21'],
                    answer: '21',
                    correct: 4
                },
                {
                    title: 'What is 6 - (-6)?',
                    options: ['0', '12', '6', '3'],
                    answer: '12',
                    correct: 2
                },
                {
                    title: 'How many sides does a hexagon have?',
                    options: ['Five', 'Seven', 'Six', 'Eight'],
                    answer: 'Six',
                    correct: 3
                },
                {
                    title: 'What is the formula for the area of a triangle?',
                    options: ['1/2bh', 'bh', '1/2b', '1/4bh'],
                    answer: '1/2bh',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Math Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })


        }

        else if (category === 'Military' || category === 'military') {
            let questions = [
                {
                    title: 'The signing of the Paris Peace Accords officially ended direct U.S. involvement in which War?',
                    options: ['Civil War', 'Vietnam War', 'World War I', 'World War II'],
                    answer: 'Vietnam War',
                    correct: 2
                },
                {
                    title: 'In 1952 the United States Air Force created Project Blue Book to study what?',
                    options: ['Birds', 'Planes', 'UFOs', 'Chinese People'],
                    answer: 'UFOs',
                    correct: 3
                },
                {
                    title: 'Fort Benning is a United States Army post located in which state?',
                    options: ['Oregon', 'California', 'Illinois', 'Georgia'],
                    answer: 'Georgia',
                    correct: 4
                },
                {
                    title: 'The profile of General George Washington appears on what United States military decoration?',
                    options: ['The Purple Heart', 'The Iron Heart', 'The One Dollar Bill', 'The Twenty Dollar Bill'],
                    answer: 'The Purple Heart',
                    correct: 1
                },
                {
                    title: 'Florence Nightingale aided the sick and wounded during which war?',
                    options: ['Vimy Ridge', 'World War I', 'The Crimean War', 'World War II'],
                    answer: 'The Crimean War',
                    correct: 3
                },
                {
                    title: 'What is the acronym for the intergovernmental military alliance based on the North Atlantic Treaty, signed in 1949?',
                    options: ['MARINE', 'NATO', 'AFONE', 'NAVY'],
                    answer: 'NATO',
                    correct: 2
                },
                {
                    title: 'Napoleon suffered defeat at Waterloo in what year?',
                    options: ['1914', '1815', '1713', '1612'],
                    answer: '1815',
                    correct: 2
                },
                {
                    title: 'The US military installation Area 51 is located in which state?',
                    options: ['Nevada', 'New Jersey', 'Oregon', 'New York'],
                    answer: 'Nevada',
                    correct: 1
                },
                {
                    title: 'What is the slang military term for the distance of one kilometer?',
                    options: ['Killer', 'Almost Mile', 'Km', 'Klick'],
                    answer: 'Klick',
                    correct: 4
                },
                {
                    title: 'World War I flying ace Manfred von Richthofen is known by what nickname?',
                    options: ['The Blue Baron', 'The Yellow Baron', 'The Red Baron', 'The Black Baron'],
                    answer: 'The Red Baron',
                    correct: 3
                },
                {
                    title: 'In which state of the United States would you find Fort Knox?',
                    options: ['Kentucky', 'Ohio', 'California', 'Florida'],
                    answer: 'Kentucky',
                    correct: 1
                },
                {
                    title: 'What is the US Navy’s equivalent to the US Army’s Basic Training?',
                    options: ['Drill Camp', 'Mud Run', 'Gun Stunt', 'Boot Camp'],
                    answer: 'Boot Camp',
                    correct: 4
                },
                {
                    title: 'In what year did World War II end?',
                    options: ['1944', '1945', '1946', '1947'],
                    answer: '1945',
                    correct: 2
                },
                {
                    title: 'The second atomic bomb ever used in war-time was dropped on what city?',
                    options: ['Tokyo', 'Hiroshima', 'Nagasaki', 'Pearl Harbour'],
                    answer: 'Nagasaki',
                    correct: 3
                },
                {
                    title: 'The Battle of Jutland was a naval battle that occurred during which war?',
                    options: ['World War I', 'Vietnam War', 'World War II', 'Vimy Ridge'],
                    answer: 'World War I',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Military Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })


        }

        else if (category === 'Movie' || category === 'movie') {
            let questions = [
                {
                    title: 'In the 2008 superhero film The Dark Knight which actor played the character Batman?',
                    options: ['Ben Affleck', 'Christian Bale', 'Peter Parker', 'Donald J Trump'],
                    answer: 'Christian Bale',
                    correct: 2
                },
                {
                    title: 'Prince Humperdinck is the main antagonist of which 1987 fantasy film?',
                    options: ['The Breakfast Club', 'Die Hard 1', 'The Princess Bride', 'E.T'],
                    answer: 'The Princess Bride',
                    correct: 3
                },
                {
                    title: 'How many movies does the series Rush Hour have?',
                    options: ['Two', 'One', 'Five', 'Three'],
                    answer: 'Three',
                    correct: 4
                },
                {
                    title: 'Chunk was a character in which 1985 movie about a group of young misfits looking for lost treasure?',
                    options: ['The Goonies', 'Peter Pan', 'Ride Along', 'Pirate Cove'],
                    answer: 'The Goonies',
                    correct: 1
                },
                {
                    title: 'According to Dominic Toretto (The Fast and the Furious), nothing is more important than...?',
                    options: ['Money', 'Cars', 'Family', 'Women'],
                    answer: 'Family',
                    correct: 3
                },
                {
                    title: 'Which Fast and Furious movie featured the character Sean Boswell?',
                    options: ['The Fast and the Furious', 'Tokyo Drift', 'The Fate of the Furious', 'Fast Five'],
                    answer: 'Tokyo Drift',
                    correct: 2
                },
                {
                    title: 'At 2020 Oscars, which South Korean film took home four awards including best picture?',
                    options: ['The Avengers', 'Parasite', 'Oceans 11', 'Crazy Rich Asians'],
                    answer: 'Parasite',
                    correct: 2
                },
                {
                    title: 'In the Marvel cinematic universe, what is the name of Thor’s home planet?',
                    options: ['Asgard', 'Ragnarok', 'God of War', 'Earth'],
                    answer: 'Asgard',
                    correct: 1
                },
                {
                    title: '"My Heart Will Go On” by Celine Dion was the theme song for which 1997 blockbuster film?',
                    options: ['American Assassin', 'Jolt', 'The Princess Bride', 'Titanic'],
                    answer: 'Titanic',
                    correct: 4
                },
                {
                    title: 'What is the name of the wookie in Star Wars?',
                    options: ['Han Solo', 'Princess Leia', 'Chewbacca', 'Jabba the Hutt'],
                    answer: 'Chewbacca',
                    correct: 3
                },
                {
                    title: 'What year was the film "Captain America The First Avenger" released?',
                    options: ['2011', '2010', '2009', '2013'],
                    answer: '2011',
                    correct: 1
                },
                {
                    title: "In the film 'Rocky IV', who was Rocky Balboa's opponent?",
                    options: ['apollo Creed', 'Tony Duke', 'James Brown', 'Ivan Drago'],
                    answer: 'Ivan Drago',
                    correct: 4
                },
                {
                    title: 'In the X-Men film franchise, Halle Berry played the role of which character?',
                    options: ['Gene', 'Storm', 'Mystique', "Charles' Wife"],
                    answer: 'Storm',
                    correct: 2
                },
                {
                    title: 'The song “Eye of the Tiger” by the band Survivor was the theme song for what movie released in 1982?',
                    options: ['Rocky I', 'Rocky II', 'Rocky III', 'Rocky IV'],
                    answer: 'Rocky III',
                    correct: 3
                },
                {
                    title: 'Which park is the most filmed location in the world?',
                    options: ['Central Park', 'Rotary Park', 'Evergreen Park', 'Grand Canyon Park'],
                    answer: 'Central Park',
                    correct: 1
                },
            ]
            var random = questions[Math.floor(Math.random() * questions.length)];
            let i = 0;

            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Movie Trivia')
                .addField(random.title, random.options.map(option => {
                    i++;
                    return `${i} - ${option}`
                }))
                .setFooter('Send your answer in chat, you have 15 seconds!')
                .setTimestamp()
            )

            let collector = new MessageCollector(message.channel, msg => msg.author.id == message.author.id, {
                time: 15000,
            });

            let tries = 0;

            collector.on('collect', async (msg) => {
                if (finished == false) {
                    let split = msg.content.split(/ +/);
                    let attempt = split.shift();

                    tries++;

                    if (attempt.toLowerCase() !== random.answer.toLowerCase() && (parseInt(attempt) !== random.correct)) return message.channel.send(`**${msg}** is incorrect.`);

                    finished = true;

                    message.channel.send(
                        new MessageEmbed()
                            .setTitle('Correct')
                            .setColor('GREEN')
                            .setDescription(`${random.correct} (${random.answer}) is correct!`)
                            .setFooter(`It took you ${tries} tries to get it`)
                            .setTimestamp()
                    );
                }
            })

            collector.on('end', async (collected) => {
                if (finished == false) return message.reply(`You timed out! The correct answer was **${random.correct} (${random.answer})**`);
            })


        }

        else if (category === 'Music' || category === 'music') {

        }

        else if (category === 'Political' || category === 'political') {

        }

        else if (category === 'Science' || category === 'science') {

        }

        else if (category === 'Space' || category === 'space') {

        }

        else if (category === 'Sports' || category === 'sports') {

        }

        else {
            message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Category Not Found')
                .setDescription(`**${category}** is not a valid category. 
                Use ${prefix}trivia for a full list of categories!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            )
            return;
        }
    }
}