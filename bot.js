// Load up the discord.js library
const Discord = require("discord.js");


// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

const rp = require('request-promise');
const moment = require('moment');
const cheerio = require('cheerio');

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

  if(command === "guildnews" || command === "guildno") {
    if (command === "guildnews") {
        if(!message.member.roles.some(r=>["Founder"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!");
        message.delete().catch(O_o=>{});
        var interval = setInterval (function () {

            rp(top_characters)
                .then(($) => {
                    //console.log($);

                    let m = moment().format('DD-MM-YYYY');

                    var name = $('.entity-name').text();
                    var nbMembers = $('tbody').eq(0).find('tr').eq(0).find('td').eq(1).text()
                    var nbCharacters = $('tbody').eq(0).find('tr').eq(1).find('td').eq(1).text()
                    var actualFame = $('tbody').eq(0).find('tr').eq(2).find('td').eq(1).text()
                    var actuelExp = $('tbody').eq(0).find('tr').eq(3).find('td').eq(1).text()
                    var serverPosition = $('tbody').eq(0).find('tr').eq(4).find('td').eq(1).text()
                    const fameEmoji = client.emojis.find(emoji => emoji.name === "fame")
                    const expEmoji = client.emojis.find(emoji => emoji.name === "maxlevel")
                    var bestPlayerName = $('tbody').eq(1).find('tr').find('td').eq(2).text()
                    var bestPlayerFame = $('tbody').eq(1).find('tr').find('td').eq(3).text()
                    var bestPlayerClass = $('tbody').eq(1).find('tr').find('td').eq(5).text()

                    var bestPlayerWeapon = $('.item').eq(0).attr('title')
                    var bestPlayerSpecial = $('.item').eq(1).attr('title')
                    var bestPlayerArmor = $('.item').eq(2).attr('title')
                    var bestPlayerRing = $('.item').eq(3).attr('title')

                    const classEmoji = client.emojis.find(emoji => emoji.name === bestPlayerClass)

                    const embed = new Discord.RichEmbed()
                        .setTitle(`**${name} // ${serverPosition}**`)
                        .setColor(9804440)
                        .setDescription(`This is the report of the day (${m})\nHere are all the stats of the guild:\n`)
                        .setURL("https://www.realmeye.com/guild/Sidekick")
                        .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                        .addField(`**Members**`, `\`\`\`${nbMembers}\`\`\``, true)
                        .addField(`**Characters**`, `\`\`\`${nbCharacters}\`\`\``, true)
                        .addField(`**Total fame** ${fameEmoji}`, `\`\`\`${actualFame}\`\`\``, true)
                        .addField(`**Total EXP** ${expEmoji}`, `\`\`\`${actuelExp}\`\`\``, true)
                        .addBlankField(false)
                        .addBlankField(false)
                        .addField(`**Actual best character** 🥇`, `\`\`\`${bestPlayerName}\`\`\``, false)
                        .addField(`**His/Her fame** ${fameEmoji}`, `\`\`\`${bestPlayerFame}\`\`\``, true)
                        .addField(`**His/Her class** ${classEmoji}`, `\`\`\`${bestPlayerClass}\`\`\``, true)
                        .addField(`**Weapon** ⚔️`, `\`\`\`${bestPlayerWeapon}\`\`\``, true)
                        .addField(`**Armor** 👕`, `\`\`\`${bestPlayerArmor}\`\`\``, true)
                        .addField(`**Special** ✨`, `\`\`\`${bestPlayerSpecial}\`\`\``, true)
                        .addField(`**Ring** 💍`, `\`\`\`${bestPlayerRing}\`\`\``, true)

                      message.channel.send(embed);
                    console.log("I've send a news");
                })
                .catch((err) => {
                    console.log(err);
                });
        }, 1 * 86400000);
        storage = interval;
    }
    if (command === "guildno") {
        message.delete().catch(O_o=>{});
        message.reply("I've stopped to fetch news");
        clearInterval(storage);
    }
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

  if(command === "bestplayer") {
    rp(top_characters)
                .then(($) => {
                    const fameEmoji = client.emojis.find(emoji => emoji.name === "fame")
                    var bestPlayerName = $('tbody').eq(1).find('tr').find('td').eq(2).text()
                    var bestPlayerFame = $('tbody').eq(1).find('tr').find('td').eq(3).text()
                    var bestPlayerClass = $('tbody').eq(1).find('tr').find('td').eq(5).text()
                    var bestPlayerWeapon = $('.item').eq(0).attr('title')
                    var bestPlayerSpecial = $('.item').eq(1).attr('title')
                    var bestPlayerArmor = $('.item').eq(2).attr('title')
                    var bestPlayerRing = $('.item').eq(3).attr('title')
                    const classEmoji = client.emojis.find(emoji => emoji.name === bestPlayerClass)
                    const embedBestPlayer = new Discord.RichEmbed()
                        .setColor(9804440)
                        .setThumbnail("https://cdn.discordapp.com/avatars/534405090459779091/d5c58057a38a0cb349449131f48fdd55.png")
                        .addField(`**Actual best character** 🥇`, `\`\`\`${bestPlayerName}\`\`\``, false)
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
                        .addField(`**Aility2**`, `\`\`\`${bestPetAby2}\`\`\``, true)
                        .addField(`**Ability3**`, `\`\`\`${bestPetAby3}\`\`\``, true)
                        .addField(`**Owner**`, `\`\`\`${bestPetOwner}\`\`\``, true)
                    message.reply(embedBestPet);
                })
                .catch((err) => {
                    console.log(err);
                });
  }

  if(command === "help") {
    const embedHelp = new Discord.RichEmbed()
        .setColor(9804440)
        .addField(`**Best pet in the guild**`, `\`\`\`+bestpet\`\`\``, false)
        .addField(`**Best character in the guild**`, `\`\`\`+bestplayer\`\`\``, false)
        .addField(`**Guide for each classes**`, `\`\`\`+classinfo {class name}\`\`\``, false)
        .addField(`**Latence of the bot**`, `\`\`\`+ping\`\`\``, false)
    message.reply(embedHelp);
  }

  /*
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  */
  
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