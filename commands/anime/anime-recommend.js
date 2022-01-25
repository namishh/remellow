const fetchData = require("../../helpers/fetchData")
const getRandom = require("../../helpers/getRandomArray")
const {MessageEmbed} = require("discord.js")
const getKey = require("../../helpers/getkeyByValue")
module.exports.data = {
  name : "anime-recommend",
  aliases : ['ani-r', 'recommend-anime'],
  description : "get some new anime to watch"
}

const emojiAnime = {
  romance : '♥',
  action : '👊',
  horror : '👻',
  thriller : '💀',
  psychological : '🧠',
  seinen : '👦',
  shounen : '👶',
  'science-fiction' : '🔭',
  harem : '🙈',
  drama : '🎥',
  suspense : '❓',
  comedy : '😂'
}

module.exports.run = async (message , args) => {
  let tags = []
  let string = '\n'
  for (const [key, val] of Object.entries(emojiAnime)) {
    string += `${key.toUpperCase()}  -  ${val}\n\n`
  }
  string+='\nSelect the tags and then react with ✅'
  const embed = new MessageEmbed().setTitle("Select the tags!").setDescription(string)
  const msg = await message.reply({embeds : [embed]})
  for (const [key, val] of Object.entries(emojiAnime)) {
    msg.react(val)
  }
  msg.react('✅')
  const filter = (r,i) => i.id === message.author.id
  const collector = await msg.createReactionCollector({filter, dispose : true})
  collector.on('collect', async c => {
    if (c.emoji.name === '✅') {
      if (!tags[0]) {
        message.channel.send("You did not choose any tags!")
      } else {
        const arg = tags.join(',')
        const data = await fetchData(`https://kitsu.io/api/edge/anime?filter[categories]=${arg}`)
        if (!data.data) {
          message.channel.send("Huh, what is that tag?")
          return
        } 
        const anime = getRandom(data.data)
        if (!anime) {
          message.channel.send("We couldnt find an anime.")
          return
        } 
        console.log(anime)

        const summary = anime.attributes.synopsis
        const title = `${anime.attributes.titles.en || ''} | ${anime.attributes.titles.en_jp || ''} | ${anime.attributes.titles.ja_jp || ''}`
        const rating = anime.attributes.averageRating
        const rank = anime.attributes.popularityRank
        const photo = anime.attributes.coverImage ? anime.attributes.coverImage.original : anime.attributes.posterImage.original
        
        const newEmbed = new MessageEmbed()
                          .setTitle(title)
                          .setColor("LUMINOUS_VIVID_PINK")
                          .setDescription(`${summary}\n⭐ - ${rating || "LMAO NO RATING"} | 🎖 - ${rank}`)
                          .setImage(photo)
        message.channel.send({embeds : [newEmbed]})
        collector.stop()
      }
    } else {
      tags.push(getKey(emojiAnime, c.emoji.name))
      console.log(tags)
    }
  })
  collector.on('remove', (reaction) => {
    tags = tags.filter(t => t !== getKey(emojiAnime, reaction.emoji.name))
    console.log(tags)
   });
}