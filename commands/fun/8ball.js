const { MessageEmbed } = require("discord.js")
const answers = require("../../db/answers_8Ball")
const random = require("../../helpers/getRandomArray")
module.exports.data = {
  name : "8ball",
  aliases : ['ask-8ball', 'yes-or-no'],
  description : "Ask the 8ball a question!"
}

module.exports.run = async(message, args) => {
  const question = args.join(' ')
  const answer = random(answers)
  console.log(answer.string, answer.type)
  const embed = new MessageEmbed().setColor(`${answer.type === 'y' ? "GREEN" : "RED"}`).setTitle(question).setDescription(answer.string)
  message.reply({embeds : [embed]})

}