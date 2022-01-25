const get = require("../../helpers/getData")
const db = require("../../db/database")
const searchData = require("../../db/search") 
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const getRandom = require("../../helpers/getRandomArray")
const errors = require("../../helpers/sendError")

module.exports.data = {
  name : "search",
  aliases : ['find', 'scout'],
  cooldown : 1000 * 60 * 3
}

module.exports.run = async (message,args) => {
  try{
    let data = await get('economy', message.author.id)
    errors.userNotFound(message, data)
    let wallet = data.wallet
    let randoms = searchData.sort(() => .5 - Math.random()).slice(0,3)
    const names = randoms.map(m => m.name)
    const row = new MessageActionRow()
    names.forEach(n => {
      let btn = new MessageButton().setCustomId(n).setLabel(n).setStyle("PRIMARY")
      row.addComponents(btn)
    })
    
    const msg = await message.reply({content : 'Where will you search?',components : [row]})
    
    const filter = (i) => {
      if(i.user.id === message.author.id) return true
      return i.reply("This is not your turn boi")
    }
    const collector = await message.channel.createMessageComponentCollector({filter, max : 1})
  
    collector.on("end", async button => {
      const id = await button.first().customId
      await button.first().deferUpdate()
      let chance = Math.random()
      chance = chance > 0.6 ? true : false
      const place = randoms.filter(p => p.name === id)[0]
      const embed = new MessageEmbed().setTitle(`You searched the ${id}`).setColor("RANDOM")
      if (chance) {
        let money = Math.floor(Math.random() * place.max)
        wallet+=money
        db.collection('economy').doc(message.author.id).update({
          wallet
        })
        embed.setDescription(getRandom(place.stringPos).replace('{money}', money))
      } else {
        embed.setDescription(getRandom(place.stringsNev))
      }
      msg.edit({
        components : [],
        embeds : [embed]
      })
    })
  } catch (err) {

  }
}