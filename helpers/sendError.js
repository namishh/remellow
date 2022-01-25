module.exports.userNotFound = (message, data) => {
  if(!data) {
    message.channel.send("User Not Found. Start Your Life with command `start`")  
    throw new Error(":)")
  }
}