const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")
const db = require("../../db/database")
const getData = require("../../helpers/getData")

module.exports.data = {
  name : 'ban',
  description : "Ban a user",
  perms : ['ADMINISTRATOR', 'BAN_MEMBERS']
}

module.exports.run = async(message, args) => {
  const user = await message.mentions.users.first() // get the first user
  const data = await getData('guilds', message.guild.id)
  const alreadyBannedMembers = data.bannedMembers
  if (!user) return
  const member = await message.guild.members.resolve(user)
  args.shift()
  const reason = args.join(' ') ? args.join(' ') : 'No Reason Was Given'
  const embed = new MessageEmbed().setColor("RED").setTitle("New Ban").setDescription(`${member.user.tag} was banned!\nReason - **${reason}**`)
  const button = new MessageButton().setCustomId("unban").setStyle("DANGER").setLabel("Undo")
  const row = new MessageActionRow().addComponents(button)
  let userId = member.user.id
  const tag = member.user.tag
  await user.send({embeds : [embed]})
  await db.collection('guilds').doc(message.guild.id).update({
    bannedMembers : [...alreadyBannedMembers, member.user.tag]
  })
  await member.ban({reason})
  const msg = await message.channel.send({embeds : [embed], components : [row]})

  const filter = (i) => {
    if(i.user.id === message.author.id) return true
    return i.reply("NO U")
  }
  const collector = await message.channel.createMessageComponentCollector({filter, max : 1})

  collector.on("end", async(ButtonInteraction) => {
    const id = await ButtonInteraction.first().customId
    if(id === 'unban') {
      const newData = await getData('guilds', message.guild.id)
      const banned = newData.bannedMembers.arrayValue.values.map(e => e.stringValue)
      const banneddudes = banned.filter(e => e != tag)
      await db.collection('guilds').doc(message.guild.id).update({
        bannedMembers : banneddudes
      })
      await message.guild.members.unban(userId)
      ButtonInteraction.first().reply(`**${member.user.tag}** was unbanned!`)
      button.setDisabled(true)
      const newRow = new MessageActionRow().addComponents(button)
      msg.edit({embeds : [embed], components : [newRow]})
    }
  })
}