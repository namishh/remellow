module.exports = {
  data : {
    name : "ping",
    aliases : ["pong"],
    description : "ping!",
  },
  async run(message, args){
    message.channel.send("PONG!")
  }
}
