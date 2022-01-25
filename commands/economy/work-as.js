const db = require("../../db/database")
const getDocs = require("../../helpers/getDocs")
const errors = require("../../helpers/sendError")

module.exports.data = {
  name : 'work-as',
  description : "get a job"
}

module.exports.run = async(message, args) => {
  try {
    const job = args[0]
    let data = await getDocs('jobs')
    data = data.map(d => d.name)
    errors.userNotFound(message, data)
    if(data.includes(job)) {
      db.collection('economy').doc(message.author.id).update({
        job : job
      })
      message.channel.send(`${message.author.tag} is now working as ${job}.`)
    } else {
      message.channel.send("No such job available")
    }
  } catch (error) {
    console.log(error)
  }
 
}
