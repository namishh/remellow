const getDocs = require("../../helpers/getDocs")
const get = require("../../helpers/getData")
const db = require("../../db/database")
module.exports.data = {
  name : "buy",
  description : "buy something"
}

module.exports.run = async (message, args) => {
  let data = await getDocs('shop')
  const item = data.filter(d => d.id === args[0])[0]
  // console.log(item)
  const userData = await get('economy', message.author.id)
  data = data.map(d => d.id)
  const inventory = userData.inventory
  const object = args[0]
  const quantity = +args[1] || 1
  
  if(!data.includes(object)) {
    message.reply("Item Doesnt Exist")
    return
  }

  let checkItem = inventory.filter(i => i.id === args[0])
  const price = item.price * quantity
  const wallet = userData.wallet
  if(price > wallet) {
    message.reply("You don't have enough money!")
    return
  } else {
    let newWallet = wallet - price
    db.collection('economy').doc(message.author.id).update({
      wallet : newWallet
    })
  }
  if(checkItem[0]){
    let newItem = {...checkItem[0], count : checkItem[0].count+=quantity}
    let newArray = inventory.filter(i => i.id != args[0])
    newArray.push(newItem)
    db.collection('economy').doc(message.author.id).update({
      inventory : newArray
    })
  } else {
    const out = {
      name : `${item.name}`,
      emoji : item.emoji,
      price : item.price,
      id : item.id,
      type : item.type,
      count : quantity,
      summary : item.summary
    }

    db.collection('economy').doc(message.author.id).update({
      inventory : [...inventory, out]
    })
  }

  message.reply(`Bought 1 ${args[0]} for ${price}.`)
}