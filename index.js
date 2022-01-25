const { Client, Collection , Intents} = require('discord.js');
const fs = require("fs")
require("dotenv").config()
module.exports.client = new Client({ intents: new Intents(32767) ,partials: ["CHANNEL", "REACTION","USER", "MESSAGE", "GUILD_MEMBER"] });

this.client.commands = new Collection()
this.client.events = new Collection()
this.client.aliases = new Collection()


// Event Handler
fs.readdirSync(`${__dirname}/events`).forEach(ev => {
  const events = require(`${__dirname}/events/${ev}`)
  this.client.events.set(events)
  events.run()
})



// Command Handler
fs.readdirSync(`${__dirname}/commands`).forEach(dir => {
  const commands = fs.readdirSync(`${__dirname}/commands/${dir}`).filter(f => f.endsWith(".js"))
  commands.forEach(cmd => {
    const command = require(`${__dirname}/commands/${dir}/${cmd}`)
    this.client.commands.set(command.data.name, command)
    if(command.data.aliases) {
      command.data.aliases.forEach(alias => {
        this.client.aliases.set(alias, command.data.name)
      })
    }
  })
})


this.client.login(process.env.TOKEN);
