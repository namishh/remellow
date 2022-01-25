const get = require("../../helpers/getData")
const db = require("../../db/database")
module.exports.data = {
  name : "start",
  aliases : ['start-journey'],
  description :  "start your journey"
}

module.exports.run = async(message, args) => {
  console.log(message.author.id)
  const data = await get('economy', message.author.id)
  if (data) {
    message.reply("User is already created")
    return
  } 
  await db.collection('economy').doc(message.author.id).set({
    userName : message.author.username,
    userID : message.author.id,
    wallet : 100,
    bank : 0,
    inventory : [],
    level : 0,
    job : '',
    userTag : `${message.author.username}#${message.author.discriminator}`
  })

  message.reply(`${message.author.username} , new user created!`)
}