const db = require("../../db/database")
module.exports.data = {
  name : "prefix",
  perms : ['ADMINISTRATOR', 'BAN_MEMBERS']
}

module.exports.run = async(message, args) => {
  let [prefix, space] = args
  space = space ? JSON.parse(space) : false
  prefix =  space ? `${prefix} ` : prefix
  console.log(space, prefix)
  await db.collection('guilds').doc(message.guild.id).update({
    prefix
  })
  await message.channel.send(`Prefix updated to - \`${prefix}\``)
}