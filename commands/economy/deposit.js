const get = require("../../helpers/getData")
const db = require("../../db/database")
const errors = require("../../helpers/sendError")
module.exports.data = {
  name : 'deposit',
  aliases : ['dep'],
  description : "Deposit Money"
}

module.exports.run = async(message, args) => {
  try {
    if (!args[0]) {
      message.channel.send("No Value Given")
      return
    }
    let value
    let data = await get('economy' , message.author.id)
    errors.userNotFound(data, message.author.id)
    let wallet = +data.wallet 
    let bank = +data.bank
    if(args[0] === 'max'|| args[0] === 'all') {
      value = wallet
    } else{
      value = +args[0]
      if (value > wallet) {
        message.reply("You Dont Have This Much Money.")
        return
      }
    }
    const newWallet = wallet - value
    const newBank = bank + value 
  
    await db.collection('economy').doc(message.author.id).update({
      wallet : newWallet,
      bank : newBank
    })
    data = await get('economy' , message.author.id)
    wallet = +data.wallet
    message.reply(`**${value}** coins deposited. Current Wallet Balance - ${wallet}`)
    
  } catch (error) {
    console.log(error)
  }
}