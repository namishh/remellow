const get = require("../../helpers/getData")
const {MessageEmbed} = require("discord.js")
const paginator = require("../../helpers/paginator")
const getDocs = require("../../helpers/getDocs")
const errors = require("../../helpers/sendError")

module.exports.data = {
  name : 'inventory',
  aliases : ['inv'],
  description : "Shows you the items you have"
}

module.exports.run = async(message, args) => {
  try {
    const userData = await get('economy', message.author.id)
    errors.userNotFound(message, userData)
    console.log(userData);
    const inventory = userData.inventory
    const pages = inventory.map(item => {
      return new MessageEmbed()
      .setTitle(`${userData.userName}'s Inventory`)
      .setColor("RANDOM")
      .addField(`${item.emoji} ${item.name}`, item.summary, false)
      .addField('Count', `${item.count}`, true)
      .addField('Price', `🪙 ${item.price}`, true)
    })
  
    paginator(message, pages)
  } catch (error) {  
  }
}