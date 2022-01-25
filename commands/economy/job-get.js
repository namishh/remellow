const {MessageEmbed} = require("discord.js")
const paginator = require("../../helpers/paginator")
const getDocs = require("../../helpers/getDocs")
const get = require("../../helpers/getData")
module.exports.data = {
  name : 'job-get',
  description : "get a job"
}

module.exports.run = async(message, args) => {
  const sData = await get('guilds', message.guild.id)
  const prefix = sData.prefix
  let data = await getDocs('jobs')
  const pages = data.map(d => {
    return new MessageEmbed()
              .setColor("RANDOM")
              .setTitle(d.name.toUpperCase())
              .addField('Salary', `🪙 ${d.salary}`)
              .setDescription(`get the job by \`${prefix}work-as ${d.name}\``)
  })
  paginator(message, pages)
}