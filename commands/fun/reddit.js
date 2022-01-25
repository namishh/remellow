const { MessageEmbed } = require("discord.js");
const fetch = require("../../helpers/fetchData")
module.exports.data = {
  name : "reddit",
  description : "get post from a subreddit"
}

const getRandom = require("../../helpers/getRandomArray")

const generateRandom = async(message,url) => {
  try{
    const data = await fetch(url)
    const posts = data.data.children
    if(!posts[0]) {
      message.reply("NOT A VALID SUBREDDIT! Remember , the name is case sensitive")
      return {
        data : false
      }
    }
    posts.shift()
    const post = getRandom(posts)
    return post
  }
  catch(err) {
    console.log(err)
  }
}

module.exports.run = async(message, args) => {
  try {
    let post;
    let isVid = true
    const msg = await message.reply("Getting Post Will take some time")
    const subreddit = args[0]
  do {
    post = await generateRandom( message,`https://www.reddit.com/r/${subreddit}.json`)
    if(!post.data.is_video) {
      isVid = false
    }
  } while (isVid)
  const {data} = post
  if(data) {
    console.log(data)
    const embed = new MessageEmbed().setTitle(data.title).setImage(data.url).setFooter(`👍 - ${data.ups} | ${data.upvote_ratio * 100}%`).setColor("RANDOM").setURL(`https://www.reddit.com${data.permalink}`)
    msg.edit({embeds : [embed], content : `Post from ${data.subreddit_name_prefixed}`})
  }  
  } catch(err) {
    message.reply("NOT A VALID SUBREDDIT! Remember , the name is case sensitive")
  }

}