const { MessageEmbed } = require("discord.js")
const fetch = require("../../helpers/fetchData")


module.exports.data = {
  name : 'joke',
  cooldown  : 10000,
  aliases : ['gimme-joke'],
  description : "gives you joke"
}

const checkJoke = (joke) => joke.type === 'single' ? 'SINGLE' : 'TWOPART'
const makeString = (joke) => {
  const type = checkJoke(joke)
  let string = ''
  if(type === 'SINGLE') string = `${joke.joke}`
  else string = `${joke.setup}\n${joke.delivery}`
  return string
}


module.exports.run = async(message, args) => {
  let type = args[0]
  if (!type) type = 'R'
  const url = type.toLowerCase() === 'pg13' ? "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit" : "https://v2.jokeapi.dev/joke/Any" 
  const joke = await fetch(url)
  const jokeString = makeString(joke)
  const embed = new MessageEmbed().setDescription(jokeString).setTitle(joke.category).setColor("RANDOM")
  message.reply({embeds : [embed]})
}