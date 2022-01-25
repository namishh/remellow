const getData = require("../../helpers/getData")
const {MessageEmbed} = require("discord.js")
const ms = require("ms")

module.exports.data = {
  name : 'mute',
  description : "mute anyone",
  aliases : ['silence']
}

module.exports.run = async(message, args) => {
  let target = message.mentions.users.first()
  const data = await getData('guilds', message.guild.id)
  const muteRoleId = data.muteRoleId.stringValue
  const role = await message.guild.roles.fetch(muteRoleId)
  if(!target) {
    message.reply("User not found!")
    return
  }

  target = await message.guild.members.cache.get(target.id)
  if (target.roles.cache.some(role => role.id === muteRoleId)) {
    message.reply("User was already muted!")
    return
  }
  target.roles.add(role)
  let valid = true
  if(args[1]) {
    const seconds = ms(args[1])
    if(!seconds) {
      valid = false
    }
    else {
      setTimeout(() => {
        target.roles.remove(role)
      }, seconds)
    }
  }

  const embed = new MessageEmbed()
  .setColor("YELLOW")
  .setTitle("New Mute 🤐")
  .setDescription(`<@${target.user.id}> has been muted ${valid ? `for ${args[1]}` : "but the time was not clear."}`)

  await message.reply({embeds : [embed]})

}