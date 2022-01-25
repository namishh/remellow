const db = require("../../db/database")
const beg = require("../../db/beg")
const getRandom = require("../../helpers/getRandomArray")
const { MessageEmbed } = require("discord.js")
const get = require("../../helpers/getData")
const errors = require("../../helpers/sendError")

module.exports.data = {
  name : 'beg',
  description : "beg for money",
  cooldown : 1000 * 60 // 1 min
}

module.exports.run = async(message, args) => {
  try {
    const data = await get('economy', message.author.id)
    errors.userNotFound(message, data)
    const willGetMoney = getRandom([true, false])
    const dude = getRandom(beg.people)
    let money = 0
    let string
    if (willGetMoney) {
      money = Math.floor(Math.random() * 1000)
      string = getRandom(beg.msg).replace('{money}', `${money}`)
    } else {
      string = getRandom(beg.noMoney)
    }
    const embed = new MessageEmbed().setTitle(dude).setDescription(string).setColor("RANDOM")
    message.reply({embeds : [embed]})
    await db.collection('economy').doc(message.author.id).update({
      wallet : data.wallet + money
    })
  } catch (error) {
    console.log(error)
  }
}