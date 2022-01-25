const getData = require("../../helpers/getData")
const {MessageEmbed} = require("discord.js")


module.exports.data = {
  name : 'unmute',
  description : "unmute anyone",
  aliases : ['un-silence']
}

module.exports.run = async(message, args) => {
  let target = message.mentions.users.first()
  const data = await getData('guilds', message.guild.id)
  const muteRoleId = data.muteRoleId
  const role = await message.guild.roles.fetch(muteRoleId)
  if(!target) {
    message.reply("User not found!")
    return
  }

  target = await message.guild.members.cache.get(target.id)
  if (target.roles.cache.some(role => role.id != muteRoleId)) {
    message.reply("User was already unmuted!")
    return
  }
  target.roles.remove(role)
  const embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("New Unute 😄")
                    .setDescription(`<@${target.user.id}> has been unmuted.`)

 
  await message.reply({embeds : [embed]})
}