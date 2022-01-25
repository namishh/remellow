const fetch = require("../../helpers/fetchData")

module.exports.data = {
  name : 'waifu',
  description : '😏😏'
}

module.exports.run = async(message, args) => {
  const data = await fetch('https://api.waifu.im/sfw/waifu/')
  console.log(data)
  message.channel.send(data.images[0].url)
}