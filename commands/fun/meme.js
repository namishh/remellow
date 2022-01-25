const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const fetch = require("../../helpers/fetchData")
const paginator = require("../../helpers/paginator")
module.exports.data = {
  name : 'meme',
  aliases : ['gimme-meme'],
  description : "gives you meme"
}

const makeMeme = async() => {
  const url = 'https://meme-api.herokuapp.com/gimme'
  const data = await fetch(url)
  const embed = new MessageEmbed()
  .setTitle(data.title)
  .setURL(data.postLink)
  .setImage(data.url)
  .setFooter(`r/${data.subreddit} | 👍 - ${data.ups}`)
  .setColor("RANDOM")
  return embed
}

module.exports.run = async(message, args) => {
  const embed = await makeMeme()
  const nextBtn = new MessageButton().setCustomId("next-meme").setLabel('Generate Meme').setStyle("SUCCESS")
  const row = new MessageActionRow().addComponents(nextBtn)
  const msg = await message.reply({embeds : [embed], components : [row]})

  const filter = (i) => {
    if(i.user.id === message.author.id) return true
    return i.reply("NO U")
  }
  const collector = await message.channel.createMessageComponentCollector({filter, max : 7})
  collector.on("collect", async(ButtonInteraction) => {
    const id = await ButtonInteraction.customId
    if(id === 'next-meme') {
      ButtonInteraction.deferUpdate()
      const newMeme = await makeMeme()
      msg.edit({embeds : [newMeme], components : [row]})
    }
  })

  collector.on('end', async(ButtonInteraction) => {
    const newMeme = await makeMeme()
    nextBtn.setDisabled(true)
    const newRow = new MessageActionRow().addComponents(nextBtn)
    msg.edit({embeds : [newMeme], components : [newRow]})
  })

}
