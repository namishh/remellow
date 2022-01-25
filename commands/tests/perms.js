module.exports.data = {
  name : "perm",
  description : "perm",
  perms : ['ADMINISTRATOR', 'BAN_MEMBERS']
}

module.exports.run = async(message) => {
  message.channel.send("YES")
}