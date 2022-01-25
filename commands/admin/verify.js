const get = require("../../helpers/getData")
const db = require("../../db/database")
module.exports.data = {
  name : "verify",
  description : 'verify yourself'
}

module.exports.run = async(message, args) => {
  const data = await get('guilds', message.guild.id)
  const verifiedRoleId = data.verifiedRoleId
  let verifiedMembers = data.verifiedMembers

  if(verifiedMembers.includes(message.author.id)) {
    message.channel.send("User already verified")
    return
  }

  verifiedMembers = [...verifiedMembers, message.author.id]
  const role = await message.guild.roles.fetch(verifiedRoleId)
  console.log(role)
  const user = await message.guild.members.cache.get(message.author.id)
  user.roles.add(role)

  message.reply("User Verified!")

  db.collection('guilds').doc(message.guild.id).update({
    verifiedMembers
  })

}