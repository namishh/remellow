const db = require("../../db/database")
const getData = require("../../helpers/getData")

module.exports.data = {
  name : 'unban',
  description : "unban a user",
  perms : ['ADMINISTRATOR', 'BAN_MEMBERS']
}

module.exports.run = async(message, args) => {
  let person = args.map(w => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ')

  const data = await getData('guilds', message.guild.id)
  const banned = data.bannedMembers
  console.log(person)
  if(banned.includes(person)) {
    const banList = await message.guild.bans.fetch();
    const bannedUser = await banList.find(user => `${user.user.tag}` === person);
    console.log(bannedUser, banList)
    const banneddudes = banned.filter(e => e != `${bannedUser.user.tag}`)

    await db.collection('guilds').doc(message.guild.id).update({
      bannedMembers : banneddudes
    })
    await message.guild.members.unban(bannedUser.user.id)

    message.channel.send("Person was unbanned!")
  } else {
    message.channel.send("Person was Never Banned!")
  }
}