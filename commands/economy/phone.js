const get = require("../../helpers/getData")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("../../db/database")
const errors = require("../../helpers/sendError")

module.exports.data = {
  name : 'mobile',
  description : 'use your mobile',
  cooldown : 1000 * 60 * 2,
  aliases : ['use-mobile']
}

module.exports.run = async(message, args) => {
  try {
    const data = await get("economy", message.author.id)
    errors.userNotFound(message, data)
    const [mobile] = data.inventory.filter(i => i.id === 'mobile_phone')
    if(!mobile) {
      message.reply("You don't have a mobule")
      return
    }
    const embed = new MessageEmbed()
                      .setColor("BLUE")
                      .setTitle(`${mobile.emoji} Mobile`)
                      .setDescription("What do you want to do with your mobile?")
  
    const postmemeButton = new MessageButton().setCustomId('post-memes').setEmoji('😂').setStyle('PRIMARY').setLabel("Post Memes")
    const editVideos = new MessageButton().setCustomId('video-edit').setEmoji('🎬').setStyle("PRIMARY").setLabel("Edit Videos")
    const makeYoutubeVid = new MessageButton().setCustomId('youtube').setEmoji('▶️').setStyle("PRIMARY").setLabel("Make Youtube Videos")
  
    const row = new MessageActionRow().addComponents(postmemeButton, editVideos, makeYoutubeVid)
    const msg = await message.reply({embeds : [embed], components : [row]})
  
    const filter = (i) => {
      if(i.user.id === message.author.id) return true
      return i.reply("This is not your turn boi")
    }
    const collector = await message.channel.createMessageComponentCollector({filter, max : 1})
  
    collector.on("end", async btn => {
      const id = await btn.first().customId
      postmemeButton.setDisabled()
      editVideos.setDisabled()
      makeYoutubeVid.setDisabled()
      const newRow = new MessageActionRow().addComponents(postmemeButton, editVideos, makeYoutubeVid)
      let chance = Math.random()
      chance = chance > 0.6 ? true : false
      if(id === 'post-memes') {
        const memeEmbed = new MessageEmbed().setTitle(`${message.author.username}'s meme session`).setColor("DARK_VIVID_PINK")
        if(!chance) {
          memeEmbed.setDescription("Your meme sucked so bad that i almost lost my life.")
        } else {
          const money = Math.floor(Math.random() * 1200)
          let wallet = data.wallet
          wallet+=money
          db.collection('economy').doc(message.author.id).update({
            wallet
          })
          memeEmbed.setDescription(`You got 🪙 ${money} with that meme. Good Job!`)
        }
        msg.edit({embeds : [memeEmbed], components : [newRow]})
      } else if (id === 'youtube') {
          const ytEmbed = new MessageEmbed().setTitle(`${message.author.username} uploaded a new video!`).setColor('FUCHSIA')
          if(!chance) {
            ytEmbed.setDescription("Your new video stinks more than your life!")
          } else {
            const money = Math.floor(Math.random() * 1400)
            let wallet = data.wallet
            wallet+=money
            db.collection('economy').doc(message.author.id).update({
              wallet
            })
            ytEmbed.setDescription(`You got 🪙 ${money} with that video. Good Job!`)
          }
          msg.edit({embeds : [ytEmbed], components : [newRow]})
      } else {
        const vidEmbed = new MessageEmbed().setTitle(`${message.author.username} edited a new video!`).setColor('BLURPLE')
        if(!chance) {
          vidEmbed.setDescription("Your new video stinks more than your life!")
        } else {
          const money = Math.floor(Math.random() * 1400)
          let wallet = data.wallet
          wallet+=money
          db.collection('economy').doc(message.author.id).update({
            wallet
          })
          vidEmbed.setDescription(`You got 🪙 ${money} with that video. Good Job!`)
        }
        msg.edit({embeds : [vidEmbed], components : [newRow]})
      }
      await btn.first().deferUpdate()
    })
  } catch (error) {
    
  }
 
}