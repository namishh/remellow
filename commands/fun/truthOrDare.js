const { MessageEmbed } = require("discord.js");
const fetch = require("../../helpers/fetchData")
module.exports.data = {
  name : "truth-dare",
  aliases :['tds'],
  description : "Let the fun begin"
}

const getRandom = (data,type) => {
  const array = data.filter(t => t.type === type)
  return array[Math.floor(Math.random() * array.length)];
}

module.exports.run = async(message, args) => {
  const data = await fetch("https://gist.githubusercontent.com/deepakshrma/9498a19a3ed460fc662c536d138c29b1/raw/f29d323b9b3f0a82f66ed58c7117fb9b599fb8d5/truth-n-dare.json")
  let ifNO = ['dare', 'truth']
  ifNO = ifNO[Math.floor(Math.random() * ifNO.length)]
  args = args[0] ? args[0] : ifNO
  args = args.toLowerCase() === 'dare' || args.toLowerCase() === 'truth' ? args.toLowerCase() : `dare`
  console.log(args)
  let challenge = args === 'dare' ? getRandom(data, 'Dare') : getRandom(data, 'Truth')
  const embed = new MessageEmbed().setTitle(challenge.summary).setColor("BLURPLE").setFooter(`Level - ${challenge.level} | Type - ${challenge.type}`)  
  message.reply({embeds : [embed]})
}