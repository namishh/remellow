const {MessageEmbed} = require("discord.js")
const paginator = require("../../helpers/paginator")
const getDocs = require("../../helpers/getDocs")
const get = require("../../helpers/getData")
module.exports.data = {
  name : 'shop',
  description : "buy something"
}

module.exports.run = async(message, args) => {
  const sData = await get('guilds', message.guild.id)
  const prefix = sData.prefix
  let data = await getDocs('shop')
  
  const pages = data.map(d => {
    return new MessageEmbed()
              .setColor("RANDOM")
              .setTitle(`${d.emoji} ${d.name}`)
              .addField('Summary', `${d.summary}`)
              .addField('Price', `🪙 ${d.price}`, true)
              .addField('Selling Price', `🪙 ${d.sellingPrice}`, true)
              .setDescription(`get the item by \`${prefix}buy ${d.id}\``)
  })
  paginator(message, pages)
}