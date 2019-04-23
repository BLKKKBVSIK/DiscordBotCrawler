# RealmeyeDiscordBotCrawler

RealmeyeDiscordBotCrawler is a NodeJS, scraping/crawling, Discord bot using DiscordJS library.

It include:

  - WebpageFetched, some webpage to put on a webserver in order to be fetched by the bot.
  - config.json, you can change the prefix and the credidentials of the bot here.

### Install

  - Clone the project.
  - Change the creditentials in the `config.json` with the token from https://discordapp.com/developers
  - Upload all the content of `WebpageFetched` folder to your web server.
  - Change the "127.0.0.1" occurence to the url of your web server in the `bot.js` 

Make sure to have npm and node installed on your pc .

MACOS: https://blog.teamtreehouse.com/install-node-js-npm-mac
LINUX: https://blog.teamtreehouse.com/install-node-js-npm-linux
WINDOWS: https://blog.teamtreehouse.com/install-node-js-npm-windows

### Tech

RealmeyeDiscordBotCrawler uses a number of open source projects to work properly:

* [node.js](http://nodejs.org) - evented I/O for the backend
* [DiscordJS](https://discord.js.org/) - interaction with the Discord API
* [PhantomJS](http://phantomjs.org/) - Crawling/Scrapping JavaScript
* [Cheerio](https://github.com/cheeriojs/cheerio) - Crawling/Scrapping.
* [Sharp](https://github.com/lovell/sharp) - Image manipulation.
* [image-data-uri](https://github.com/DiegoZoracKy/image-data-uri) - Convert data-uri to .png files.

### Commands supported + Demo

Here is the commands that you can use with the bot.

| Plugin | README |
| ------ | ------ |
| help | [print help (Click for demo) ](https://image.noelshack.com/fichiers/2019/17/2/1556042378-screenshot-2019-04-23-at-20-57-10.png) |
| player | [print basic player info (Click for demo)](https://image.noelshack.com/fichiers/2019/17/2/1556042378-screenshot-2019-04-23-at-20-57-53.png) |
| pet | [print basic pet info (Click for demo)](https://image.noelshack.com/fichiers/2019/17/2/1556042728-screenshot-2019-04-23-at-21-05-10.png) |
| bestplayer | [print best player info (Click for demo)](https://image.noelshack.com/fichiers/2019/17/2/1556042378-screenshot-2019-04-23-at-20-57-27.png) |
| bestpet | [print best pet info (Click for demo)](https://image.noelshack.com/fichiers/2019/17/2/1556042378-screenshot-2019-04-23-at-20-57-37.png) |
| playerstats | [print stats and needed pots to be maxed (Click for demo)](https://image.noelshack.com/fichiers/2019/17/2/1556042378-screenshot-2019-04-23-at-20-59-17.png) |
| classinfo | [display the basic class info](https://image.noelshack.com/fichiers/2019/17/2/1556042727-screenshot-2019-04-23-at-21-04-56.png) |
| guild | [display guild info](https://image.noelshack.com/fichiers/2019/17/2/1556042378-screenshot-2019-04-23-at-20-58-05.png) |

### Goal
The project has no goal, its only here for my own entertainment, but if you're interested by a feature, or has any question, you can send me a message via Discord: BLKKKBVSIK#7298 or by email: contact@enzoconty.dev

