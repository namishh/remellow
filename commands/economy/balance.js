const { MessageEmbed } = require("discord.js")
const errors = require("../../helpers/sendError")
const get = require("../../helpers/getData")

module.exports.data = {
  name : "balance",
  aliases : ['bal', 'balanc'],
  description : "shows you your balance"
}

module.exports.run = async(message, args) => {
  try{
    const user = message.author.id
    const data = await get('economy', user)
    errors.userNotFound(message, data)
    const wallet = +data.wallet 
    const bank = +data.bank
    console.log(wallet, bank)
    const embed = new MessageEmbed().setColor("RANDOM").addField('Wallet', `${wallet}`, true).addField('Bank' , `${bank}`, true).setTitle(`${data.userName}'s Balance`).setImage(await message.author.displayAvatarURL())
    message.reply({embeds : [embed]})
  } catch(e) {
    console.log(e)
  }
}