const { MessageEmbed } = require("discord.js")
const fetch = require("../../helpers/fetchData")

module.exports.data = {
  name : "anime-search",
  description : 'search anime',
  aliases : ['search-anime', 'ani-s']
}

module.exports.run = async(message, args) => {
  const animeName = args.join() || 'Attack On Titan'
  const data = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`)
  const anime = data.data[0]
  if (!anime) {
    message.channel.send("No such anime found! Try some other keywords maybe?")
    return
  }
  const summary = anime.attributes.synopsis
  const title = `${anime.attributes.titles.en} | ${anime.attributes.titles.en_jp} | ${anime.attributes.titles.ja_jp}`
  const rating = anime.attributes.averageRating
  const rank = anime.attributes.popularityRank
  const photo = anime.attributes.coverImage.original || anime.attributes.posterImage.original
  
  const embed = new MessageEmbed()
                    .setTitle(title)
                    .setColor("LUMINOUS_VIVID_PINK")
                    .setDescription(`${summary}\n⭐ - ${rating} | 🎖 - ${rank}`)
                    .setImage(photo)
                    .setURL(`https://animixplay.to/?q=${anime.attributes.titles.en.split(' ').join('%20')}`)

  message.channel.send({embeds : [embed]})

}