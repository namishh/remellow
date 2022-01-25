const { MessageEmbed } = require("discord.js")

module.exports.data = {
  name : 'kick',
  description : "Kick a user",
  perms : ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS']
}

module.exports.run = async(message, args) => {
  const user = await message.mentions.users.first() // get the first user
  if (!user) return
  const member = await message.guild.members.resolve(user)
  args.shift()
  const reason = args.join(' ') ? args.join(' ') : 'No Reason Was Given'
  const embed = new MessageEmbed().setColor("RED").setTitle("Person Kicked").setDescription(`${member.user.tag} was kicked!\nReason - **${reason}**`)
  let userId = member.user.id
  console.log(userId)
  await user.send({embeds : [embed]})
  await member.kick()
  await message.channel.send({embeds : [embed]})
}