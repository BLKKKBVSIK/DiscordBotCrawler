// Load up the discord.js library
const Discord = require("discord.js");


// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

const rp = require('request-promise');
const moment = require('moment');
const http = require('http');
const cheerio = require('cheerio');
const ImageDataURI = require('image-data-uri');
const sharp = require('sharp');
const phantom = require('phantom');

const top_characters = {
    uri: `http://37.187.73.33/html/rotmg/top_characters.php`,
    transform: function (body) {
      return cheerio.load(body);
    }
};

const top_pets = {
    uri: `http://37.187.73.33/html/rotmg/top_pets.php`,
    transform: function (body) {
      return cheerio.load(body);
    }
};


function playerOnPh(r, message, args) {
    const characters = {
        uri: `http://37.187.73.33/html/rotmg/character.php?player=${args[0]}`,
        transform: function (body) {
        return cheerio.load(body);
        }
    };

    rp(characters)
        .then(($) => {
            if ($('.nav-pills').find('li').eq(0).find('a').text() != "Characters (0)") {

                        var x = 0;
                        var y = 0;
    
                        $('tbody').eq(1).find('tr').each(function(i, elem) {
                            //console.log(`Perso=`+i +`// Fame=`+ Number($(this).find('td').eq(5).text()));
                            if (Number($(this).find('td').eq(5).text()) > x) {
                                x = Number($(this).find('td').eq(5).text())
                                y = i
                                
                            }
                        });
                    
                        const fameEmoji = client.emojis.find(emoji => emoji.name === "fame")
                        //console.log(r);
                        
                        //console.log(`\n\n\nFinaly = `+ y+ `\nFinalx=` + x);
                        
                        
                        sharp(`/var/www/html/rotmg/img/dimage${r}.png`).extract({ left: (y*50), top: 0, width: 50, height: 50 }).toFile(`/var/www/html/rotmg/img/cimage${r}.png`)
                        .then(function(new_file_info) {
                            //console.log("Image cropped and saved");
                        })
                        .catch(function(err) {
                            //console.log(`An error occured:\n${err}`);
                        });
                        


                        var bestPlayerName = $('.entity-name').text()
                        var bestPlayerFame = $('tbody').eq(1).find('tr').eq(y).find('td').eq(5).text()
                        var bestPlayerClass = $('tbody').eq(1).find('tr').eq(y).find('td').eq(2).text()
                        var bestPlayerWeapon = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(0).attr('title')
                        var bestPlayerSpecial = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(1).attr('title')
                        var bestPlayerArmor = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(2).attr('title')
                        var bestPlayerRing = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(3).attr('title')
                        var bestPlayerStats = $('tbody').eq(1).find('tr').eq(y).find('td').eq(9).text()
                        if (!isNaN(bestPlayerClass)) {
                            var bestPlayerName = $('.entity-name').text()
                            var bestPlayerFame = $('tbody').eq(1).find('tr').eq(y).find('td').eq(4).text()
                            var bestPlayerClass = $('tbody').eq(1).find('tr').eq(y).find('td').eq(1).text()
                            var bestPlayerWeapon = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(0).attr('title')
                            var bestPlayerSpecial = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(1).attr('title')
                            var bestPlayerArmor = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(2).attr('title')
                            var bestPlayerRing = $('tbody').eq(1).find('tr').eq(y).find('.item').eq(3).attr('title')
                            var bestPlayerStats = $('tbody').eq(1).find('tr').eq(y).find('td').eq(8).text()
                        }
    
                        const classEmoji = client.emojis.find(emoji => emoji.name === bestPlayerClass)
                        const embedPlayer = new Discord.RichEmbed()
                            .setColor(9804440)
                            .setThumbnail(`http://37.187.73.33/html/rotmg/img/cimage${r}.png`)
                            .setURL(`https://www.realmeye.com/player/${args[0]}`)
                            .addField(`**Name**`, `\`\`\`${bestPlayerName}\`\`\``, true)
                            .addField(`**Maxed stats** 🥇`, `\`\`\`${bestPlayerStats}\`\`\``, true)
                            .addField(`**His/Her fame** ${fameEmoji}`, `\`\`\`${bestPlayerFame}\`\`\``, true)
                            .addField(`**His/Her class** ${classEmoji}`, `\`\`\`${bestPlayerClass}\`\`\``, true)
                            .addField(`**Weapon** ⚔️`, `\`\`\`${bestPlayerWeapon}\`\`\``, true)
                            .addField(`**Armor** 👕`, `\`\`\`${bestPlayerArmor}\`\`\``, true)
                            .addField(`**Special** ✨`, `\`\`\`${bestPlayerSpecial}\`\`\``, true)
                            .addField(`**Ring** 💍`, `\`\`\`${bestPlayerRing}\`\`\``, true)
                        message.reply(embedPlayer);
                    } else {
                        message.reply("This player don't have any character alive at the the moment.")
                    }
                })
                    .catch((err) => {
                        console.log(err);
                    });
}


async function applyingToGuild(receivedMessage) {
    receivedMessage.author.send({
        files: [{
            attachment: 'https://cdn.discordapp.com/attachments/364120257901625344/544488817038721035/bannerfofo.png',
            name: 'banner.png'
          }]      
    })
    let firstMsg = await receivedMessage.author.send("Hii, type something");

    let filter = () => true; // you don't need it, since it's a DM.
    let collected = await firstMsg.channel.awaitMessages(filter, {
        maxMatches: 1, // you only need one message
        time: 60000 // the time you want it to run for
      }).catch(console.log);
  
    if (collected && collected.size > 0) {
      let password = collected.first().content.split(' ')[0]; // grab the password
      //collected.forEach(msg => msg.delete()); // delete every collected message (and so the password)
      firstMsg.channel.send(password);
    } else await firstMsg.edit("Command timed out :("); // no message has been received
  
    //firstMsg.delete(30000); // delete it after 30 seconds
}

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
var storage = 0;
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`in Sidekick guild hall`);

});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'members-logs');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member

    let browserColor = "";
    let verifiedColor = "";

    if (member.user.client.browser == false) {
        browserColor = "diff\n-"
    } else {
        browserColor = "css\n"
    }

    if (member.user.client.user.verified == false) {
        verifiedColor = "diff\n-"
    } else {
        verifiedColor = "css\n"
    }

    let m = moment(member.joinedAt).format('DD-MM-YYYY');
    let mTwo = moment(member.user.createdAt).format('DD-MM-YYYY');

    const embedNewMember = new Discord.RichEmbed()
        .setTitle(`**${member.user.username}#${member.user.discriminator}**`)
        .setColor(9804440)
        .setDescription(`Joined server on **${m}**\nJoined Discord on **${mTwo}**`)
        .setThumbnail(`${member.user.avatarURL}`)
        .addField(`**On browser**`, `\`\`\`${browserColor}${member.user.client.browser}\`\`\``, true)
        .addField(`**Is Verified**`, `\`\`\`${verifiedColor}${member.user.client.user.verified}\`\`\``, true)

    channel.send(embedNewMember);
  });

  client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'members-logs');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member

    let m = moment().format('DD-MM-YYYY');

    const embedNewMember = new Discord.RichEmbed()
        .setTitle(`**${member.user.username}#${member.user.discriminator}**`)
        .setColor(16189721)
        .setDescription(`Leaved the server on **${m}**`)
        .setThumbnail(`${member.user.avatarURL}`)
    channel.send(embedNewMember);
  });

client.on('error', console.error);

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.reply("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "classinfo") {
    if (args[0]) {
        var classInfo = args[0].toLowerCase();
        const classEmoji = client.emojis.find(emoji => emoji.name === classInfo.charAt(0).toUpperCase() + classInfo.slice(1));
        if(classInfo == "huntress" || classInfo == "wizard" || classInfo == "assassin" || classInfo == "rogue" || classInfo == "priest" ||
        classInfo == "warrior" || classInfo == "paladin" || classInfo == "samurai" || classInfo == "mystic" || classInfo == "archer" ||
        classInfo == "necromancer" || classInfo == "knight" || classInfo == "sorcerer" || classInfo == "trickster" || classInfo == "ninja") {
            message.reply(`Here is the guide for playing ${classEmoji} \n https://www.realmeye.com/wiki/${classInfo}-class-guide`);
        }
        else {
            message.reply(`Sorry, i didn't recognise the class name.`);
        }
    } else {
        message.reply(`The command is not complete, type \`+help\`.`);
    }
  }



    if(command === "guild") {
        rp(top_characters)
            .then(($) => {
                var nbMembers = $('tbody').eq(0).find('tr').eq(0).find('td').eq(1).text()
                var name = $('.entity-name').text();
                var nbCharacters = $('tbody').eq(0).find('tr').eq(1).find('td').eq(1).text()
                var actualFame = $('tbody').eq(0).find('tr').eq(2).find('td').eq(1).text()
                var actuelExp = $('tbody').eq(0).find('tr').eq(3).find('td').eq(1).text()
                var serverPosition = $('tbody').eq(0).find('tr').eq(4).find('td').eq(1).text()
                const fameEmoji = client.emojis.find(emoji => emoji.name === "fame")
                const expEmoji = client.emojis.find(emoji => emoji.name === "maxlevel")
                const embed = new Discord.RichEmbed()
                    .setTitle(`**${name} // ${serverPosition}**`)
                    .setColor(9804440)
                    .setDescription(`Here are all the stats of the guild:\n`)
                    .setURL("https://www.realmeye.com/guild/Sidekick")
                    .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                    .addField(`**Members**`, `\`\`\`${nbMembers}\`\`\``, true)
                    .addField(`**Characters**`, `\`\`\`${nbCharacters}\`\`\``, true)
                    .addField(`**Total fame** ${fameEmoji}`, `\`\`\`${actualFame}\`\`\``, true)
                    .addField(`**Total EXP** ${expEmoji}`, `\`\`\`${actuelExp}\`\`\``, true)
                message.reply(embed);
                })
                .catch((err) => {
                    console.log(err);
                });
    }


  if(command === "bestplayer") {
    rp(top_characters)
                .then(($) => {
                    const fameEmoji = client.emojis.find(emoji => emoji.name === "fame")
                    var bestPlayerName = $('tbody').eq(1).find('tr').find('td').eq(2).text()
                    var bestPlayerFame = $('tbody').eq(1).find('tr').find('td').eq(3).text()
                    var bestPlayerClass = $('tbody').eq(1).find('tr').find('td').eq(5).text()
                    var bestPlayerStats = $('tbody').eq(1).find('tr').find('td').eq(7).text()
                    var bestPlayerWeapon = $('.item').eq(0).attr('title')
                    var bestPlayerSpecial = $('.item').eq(1).attr('title')
                    var bestPlayerArmor = $('.item').eq(2).attr('title')
                    var bestPlayerRing = $('.item').eq(3).attr('title')
                    const classEmoji = client.emojis.find(emoji => emoji.name === bestPlayerClass)
                    const embedBestPlayer = new Discord.RichEmbed()
                        .setColor(9804440)
                        .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                        .addField(`**Actual best character** 🥇`, `\`\`\`${bestPlayerName}\`\`\``, true)
                        .addField(`**Maxed stats** 🥇`, `\`\`\`${bestPlayerStats}\`\`\``, true)
                        .addField(`**His/Her fame** ${fameEmoji}`, `\`\`\`${bestPlayerFame}\`\`\``, true)
                        .addField(`**His/Her class** ${classEmoji}`, `\`\`\`${bestPlayerClass}\`\`\``, true)
                        .addField(`**Weapon** ⚔️`, `\`\`\`${bestPlayerWeapon}\`\`\``, true)
                        .addField(`**Armor** 👕`, `\`\`\`${bestPlayerArmor}\`\`\``, true)
                        .addField(`**Special** ✨`, `\`\`\`${bestPlayerSpecial}\`\`\``, true)
                        .addField(`**Ring** 💍`, `\`\`\`${bestPlayerRing}\`\`\``, true)
                    message.reply(embedBestPlayer);
                })
                .catch((err) => {
                    console.log(err);
                });
  }


  if(command === "player") {
    if (args[0]) {
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
              page.open(`http://37.187.73.33/html/rotmg/character.php?player=${args[0]}`).then(function(status) {
                //console.log(status);
                page.property('content').then(function(content) {
                    var $ = cheerio.load(content);
                    var notFound = $('.player-not-found').find('li').text()
                    var notFound = notFound.substr(0, 12);
    
                    if (notFound == `haven't seen`)
                    {
                        message.reply(`I did'nt find the player "${args[0]}"`);
                        return;
                    }
                    else {
                        var playerBackground = $('#playerBackground').text()
                        let r = Math.random().toString(36).substring(15) + Math.random().toString(36).substring(2, 15);
                        console.log(playerBackground);
                        ImageDataURI.outputFile(playerBackground, `/var/www/html/rotmg/img/dimage${r}.png`);
                        setTimeout(() => playerOnPh(r, message, args), 500);
                    }
                  page.close();
                  ph.exit();
                });
              });
            });
          });

                
    } else {
        message.reply(`You need to indicate me a player name`)
    }
}

if(command === "playerstats") {
    if (args[0]) {

        var x = 0;
        var y = 0;
        var k = [];
        
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
              page.open(`http://37.187.73.33/html/rotmg/character.php?player=${args[0]}`).then(function(status) {
                //console.log(status);
                page.property('content').then(function(content) {

                    var $ = cheerio.load(content);
                    var notFound = $('.player-not-found').find('li').text()
                    var notFound = notFound.substr(0, 12);
    
                    if (notFound == `haven't seen`)
                    {
                        message.reply(`I did'nt find the player "${args[0]}"`);
                        return;
                    }
                    else {

                        $('tbody').eq(1).find('tr').each(function(i, elem) {
                            var res = $(this).find('td').eq(5).text().replace(/\D/g, "");
                            res = parseInt(res, 10);
                            k[i] = res;
                            if (res > x) {
                                x = res
                                y = i
                            }
        
                        })

                        stats_hp = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(0).find('td').eq(0).text().substr(4);
                        stats_mp = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(0).find('td').eq(1).text().substr(4);
                        stats_attack = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(1).find('td').eq(0).text().substr(5);
                        stats_defense = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(1).find('td').eq(1).text().substr(5);
                        stats_speed = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(1).find('td').eq(2).text().substr(5);
                        stats_vitality = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(2).find('td').eq(0).text().substr(5);
                        stats_wisdom = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(2).find('td').eq(1).text().substr(5);
                        stats_dexterity = $('tbody').eq(1).find('tr').eq(y).find('#statsnum').eq(2).find('td').eq(2).text().substr(5);

                        hp_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(0).find('td').eq(0).text().split("(").pop().replace(")", '');
                        mp_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(0).find('td').eq(1).text().split("(").pop().replace(")", '');
                        atk_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(1).find('td').eq(0).text();
                        def_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(1).find('td').eq(1).text();
                        spd_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(1).find('td').eq(2).text();
                        vit_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(2).find('td').eq(0).text();
                        wis_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(2).find('td').eq(1).text();
                        dex_left = $('tbody').eq(1).find('tr').eq(y).find('#statsleft').eq(2).find('td').eq(2).text();

                        var maxedStatsCount = 0;
                        if(!hp_left) {
                        hp_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!mp_left) {
                        mp_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!atk_left) {
                        atk_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!def_left) {
                        def_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!spd_left) {
                        spd_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!vit_left) {
                        vit_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!wis_left) {
                        wis_left = "**MAXED**";
                        maxedStatsCount++
                        }
                        if(!dex_left) {
                        dex_left = "**MAXED**";
                        maxedStatsCount++
                        }

                        const bestPlayerName = $('.entity-name').text()
                        const embedPlayer = new Discord.RichEmbed()
                            .setColor(9804440)
                            .setDescription(`Here is the stats of the best character of ${bestPlayerName}`)
                            .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                            .addField(`**Maxed Stats**`, `\`\`\`${maxedStatsCount.toString()}/8\`\`\``, false)
                            .addField(`**HP** | ${hp_left}`, `\`\`\`${stats_hp}\`\`\``, true)
                            .addField(`**MP** | ${mp_left}`, `\`\`\`${stats_mp}\`\`\``, true)
                            .addField(`**ATK** | ${atk_left}`, `\`\`\`${stats_attack}\`\`\``, true)
                            .addField(`**DEF** | ${def_left}`, `\`\`\`${stats_defense}\`\`\``, true)
                            .addField(`**SPD** | ${spd_left}`, `\`\`\`${stats_speed}\`\`\``, true)
                            .addField(`**VIT** | ${vit_left}`, `\`\`\`${stats_vitality}\`\`\``, true)
                            .addField(`**WIS** | ${wis_left}`, `\`\`\`${stats_wisdom}\`\`\``, true)
                            .addField(`**DEX** | ${dex_left}`, `\`\`\`${stats_dexterity}\`\`\``, true)
                        message.reply(embedPlayer);
                    }
                  page.close();
                  ph.exit();
                });
              });
            });
          });

                
    } else {
        message.reply(`You need to indicate me a player name`)
    }
}


  if(command === "bestpet") {
    rp(top_pets)
                .then(($) => {
                    var bestPetName = $('tbody').eq(1).find('tr').find('td').eq(2).text()
                    var bestPetRarity = $('tbody').eq(1).find('tr').find('td').eq(3).text()
                    var bestPetFamily = $('tbody').eq(1).find('tr').find('td').eq(4).text()
                    var bestPetAby1 = $('tbody').eq(1).find('tr').find('td').eq(5).text() + "(Lvl." + $('tbody').eq(1).find('tr').find('td').eq(6).text() + ")"
                    var bestPetAby2 = $('tbody').eq(1).find('tr').find('td').eq(7).text() + "(Lvl." + $('tbody').eq(1).find('tr').find('td').eq(8).text() + ")"
                    var bestPetAby3 = $('tbody').eq(1).find('tr').find('td').eq(9).text() + "(Lvl." + $('tbody').eq(1).find('tr').find('td').eq(10).text() + ")"
                    var bestPetOwner = $('tbody').eq(1).find('tr').find('td').eq(12).text()
                    const embedBestPet = new Discord.RichEmbed()
                        .setColor(9804440)
                        .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                        .addField(`**Actual best pet** 🥇`, `\`\`\`${bestPetName}\`\`\``, false)
                        .addField(`**Rarity** ✨`, `\`\`\`${bestPetRarity}\`\`\``, true)
                        .addField(`**Family** 🐱`, `\`\`\`${bestPetFamily}\`\`\``, true)
                        .addField(`**Ability1**`, `\`\`\`${bestPetAby1}\`\`\``, true)
                        .addField(`**Ability2**`, `\`\`\`${bestPetAby2}\`\`\``, true)
                        .addField(`**Ability3**`, `\`\`\`${bestPetAby3}\`\`\``, true)
                        .addField(`**Owner**`, `\`\`\`${bestPetOwner}\`\`\``, true)
                    message.reply(embedBestPet);
                })
                .catch((err) => {
                    console.log(err);
                });
  }

if(command === "pet") {
    if (args[0]) {
        const pets = {
            uri: `http://37.187.73.33/html/rotmg/pet.php?player=${args[0]}`,
            transform: function (body) {
            return cheerio.load(body);
            }
        };

        rp(pets)
                    .then(($) => {

                        var notFound = $('.player-not-found').find('li').text()
                        var notFound = notFound.substr(0, 12);

                        if (notFound == `haven't seen`)
                        {
                            message.reply(`I did'nt find the player "${args[0]}"`);
                            return;
                        }
                        else {
                            var bestPetName = $('tbody').eq(1).find('tr').find('td').eq(1).text()
                            var bestPetRarity = $('tbody').eq(1).find('tr').find('td').eq(2).text()
                            var bestPetFamily = $('tbody').eq(1).find('tr').find('td').eq(3).text()
                            var bestPetAby1 = $('tbody').eq(1).find('tr').find('td').eq(5).text() + "(Lvl." + $('tbody').eq(1).find('tr').find('td').eq(6).text() + ")"
                            var bestPetAby2 = $('tbody').eq(1).find('tr').find('td').eq(7).text() + "(Lvl." + $('tbody').eq(1).find('tr').find('td').eq(8).text() + ")"
                            var bestPetAby3 = $('tbody').eq(1).find('tr').find('td').eq(9).text() + "(Lvl." + $('tbody').eq(1).find('tr').find('td').eq(10).text() + ")"
                            var bestPetPlace = $('tbody').eq(1).find('tr').find('td').eq(4).text()
                            const embedBestPet = new Discord.RichEmbed()
                                .setColor(9804440)
                                .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                                .addField(`**Name** 🦄`, `\`\`\`${bestPetName}\`\`\``, false)
                                .addField(`**Rarity** ✨`, `\`\`\`${bestPetRarity}\`\`\``, true)
                                .addField(`**Family** 🐱`, `\`\`\`${bestPetFamily}\`\`\``, true)
                                .addField(`**Ability1**`, `\`\`\`${bestPetAby1}\`\`\``, true)
                                .addField(`**Aility2**`, `\`\`\`${bestPetAby2}\`\`\``, true)
                                .addField(`**Ability3**`, `\`\`\`${bestPetAby3}\`\`\``, true)
                                .addField(`**Place**`, `\`\`\`${bestPetPlace}\`\`\``, true)
                            message.reply(embedBestPet);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
    }
    else {
        message.reply(`You need to indicate me a player name`)
    }
}

if(command === "apply") {
    return applyingToGuild(message);
    //message.author.send("Hii")
}


  if(command === "help") {
    const embedHelp = new Discord.RichEmbed()
        .setColor(9804440)
        .addField(`**Best pet in the guild**`, `\`\`\`+bestpet\`\`\``, false)
        .addField(`**Best pet in the guild**`, `\`\`\`+pet {name}\`\`\``, false)
        .addField(`**Best character in the guild**`, `\`\`\`+bestplayer\`\`\``, false)
        .addField(`**Fetch player info**`, `\`\`\`+player {name}\`\`\``, false)
        .addField(`**Guide for each classes**`, `\`\`\`+classinfo {class name}\`\`\``, false)
        .addField(`**Guild stats**`, `\`\`\`+guild\`\`\``, false)
        .addField(`**Latence of the bot**`, `\`\`\`+ping\`\`\``, false)
        .addField(`**Get the stats of a player**`, `\`\`\`+playerstats {name}\`\`\``, false)
    message.reply(embedHelp);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.roles.some(r=>["Founder"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);