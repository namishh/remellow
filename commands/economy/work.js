const getDocs = require("../../helpers/getDocs")
const get = require("../../helpers/getData")
const db = require("../../db/database")
const errors = require("../../helpers/sendError")

module.exports.data = {
  name : "work", 
  aliases : ['job'],
  description : "JOB",
  cooldown : 1000 * 60 * 60 // 1 hour
}

module.exports.run = async(message, args) => {
  try {
    let data = await getDocs('jobs')
    let userData = await get('economy', message.author.id)
    errors.userNotFound(message, userData)
    let {job, wallet} = userData
    if(!job) {
      message.reply("You dont have a job\nGet one By `!work-as {job-name}`")
      return
    }
    let salary = data.filter(j => j.name === job)[0].salary
    console.log(salary)
    let workQuality = Math.trunc(Math.random()  * 100)
    workQuality = workQuality > 80 ? 300 : -500
    wallet = +wallet
    salary += workQuality
    wallet += salary
    console.log(wallet)
    await db.collection('economy').doc(message.author.id).update({
      wallet : wallet
    })
  
    message.reply(`You got ${salary} coins for your work!`)
  } catch (error) {
    console.log(error)
  }
}