const client = require("../index").client
module.exports.run = () => {
  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    changePresnece(client)
  });
}


const changePresnece = async(client)  =>{
  const activities_list = [
    "Boredness", 
    "My Life Burn", 
    "!help if u are stuck",
    "Netflix",
    "Myself",
    "Myself Cry"
    ]; 
  setInterval(() => {
      const index = Math.floor(Math.random() * activities_list.length);
      let act = `${index % 2 === 0 ? "PLAYING" : "WATCHING"}`
      client.user.setActivity(activities_list[index], { type: act }); 
  }, 10000);
}