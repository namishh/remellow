const {MessageButton, MessageActionRow} = require("discord.js")
const ms = require("ms")

const paginator = async (message, pages) => {
  if(!message && !message.channel) throw new Error("provide msg bro")
  if(!pages) throw new Error("plz provide pages 📃")

  let page = 0

  const btn1 = new MessageButton()
                  .setEmoji('⬅️')
                  .setCustomId("prev")
                  .setStyle("SUCCESS")
  const btn2 = new MessageButton()
                  .setEmoji('➡️')
                  .setCustomId("next")
                  .setStyle("SUCCESS")

  const btn1After = new MessageButton()
                  .setEmoji('⬅️')
                  .setCustomId("first")
                  .setStyle("SUCCESS")
                  .setDisabled(true)
  const btn2After = new MessageButton()
                  .setEmoji('➡️')
                  .setCustomId("last")
                  .setStyle("SUCCESS")
                  .setDisabled(true)
  
  const row = new MessageActionRow().addComponents(btn1, btn2)
  const deadRow = new MessageActionRow().addComponents(btn1After, btn2After)
  console.log(pages)
  const curpage = await message.channel.send({embeds : [pages[0]], components : [row]})

  const filter = (i) => {
    if(i.user.id === message.author.id) return true
    return i.reply("NO U")
  }
  const collector = await curpage.createMessageComponentCollector({filter, time : ms('40s')})
  collector.on('collect',async ButtonInteraction => {
    ButtonInteraction.deferUpdate()
    const id = await ButtonInteraction.customId
    if(id === 'prev') {
      page = page > 0 ? --page : pages.length - 1
    } else if(id === 'next') {
      page = page + 1 < pages.length ? ++page : 0
    }

    curpage.edit({embeds : [pages[page]], components : [row]})
  })

  collector.on('end', () => {
    if(!curpage.deleted) {
      curpage.edit({embeds : [pages[page]], components : [deadRow]})
    }
  })

  return curpage
}


module.exports = paginator