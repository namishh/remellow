const getData = require("../helpers/getData")
const {Collection} = require("discord.js")
const client = require("../index").client
const Timeout = new Collection()
const ms = require("ms")
module.exports.run = () => {
  client.on("messageCreate", async(message) => {
    const data = await getData('guilds', message.guild.id)
    const PREFIX = data.prefix
    if(message.author.bot || !message.content.startsWith(PREFIX)) return
    const [CMD, ...ARGS] = message.content.toLowerCase().substring(PREFIX.length).trim().split(/\s+/)
    let command = client.commands.get(CMD) || client.commands.get(client.aliases.get(CMD))
    if(!command) {
      message.channel.send("Invalid Command")
      return
    } 
    checkAndRun(message , command, ARGS)    
  })
}

// Permissions Handler
const checkAndRun = (message, command, ARGS) => {
  let allowed = false
  if (command.data.perms) {
    let perms = []
    command.data.perms.forEach(perm => {
      if(message.member.permissions.has(perm)) {
        perms.push(perm)
      }
    });
    if(!perms[0]){
      allowed = false
      message.reply("You Can't tun this command")

    } else { 
      allowed = true
    }
  }
  else{
    allowed = true
  }

  // Cooldown Handler
  if(command.data.cooldown) {
    if(Timeout.has(`${command.data.name}${message.author.id}`)) return message.channel.send(`You are on a \`${ms(Timeout.get(`${command.data.name}${message.author.id}`) - Date.now(), {long : true})}\` cooldown on the command **${command.data.name}**.`)
    allowed = true
    Timeout.set(`${command.data.name}${message.author.id}`, Date.now() + command.data.cooldown)
    setTimeout(() => {
        Timeout.delete(`${command.data.name}${message.author.id}`)
    }, command.data.cooldown)
  } else {
    allowed = true
  }

  if(allowed) command.run(message, ARGS)
}