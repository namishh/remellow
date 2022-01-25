const db = require("../db/database")
const client = require("../index").client
module.exports.run = () => {
  client.on("guildCreate", async(guild) => {
    const muteRole = await guild.roles.create({
      permissions  : [
        'VIEW_CHANNEL',
        'READ_MESSAGE_HISTORY'
      ],
      name : "Muted",
      color : "DARK_BUT_NOT_BLACK",
      position : 0,
      mentionable : false,
    })
    
    guild.channels.cache.forEach(channel => {
      channel.permissionOverwrites.create(muteRole, {
        SEND_MESSAGES : false,
        ADD_REACTIONS : false,
        SPEAK : false,
        CONNECT : false
      })
    })

    const role = await guild.roles.create({
      permissions : ['ADD_REACTIONS', 
                    'ATTACH_FILES', 
                    'CHANGE_NICKNAME', 
                    'CONNECT', 
                    'EMBED_LINKS', 
                    'SEND_MESSAGES', 
                    'SPEAK', 
                    'USE_EXTERNAL_EMOJIS',
                    "READ_MESSAGE_HISTORY"
                    ],
      name : "Verified",
      color : "DARK_GREY",
      position : 1,
      mentionable : false
    })

    await guild.roles.everyone.edit({
      permissions : ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
    })

    await guild.channels.create('verify-here', {
      type : "GUILD_TEXT",
      permissionOverwrites : [
        {
          id : role.id,
          deny : ['VIEW_CHANNEL']
        },
        {
          id : guild.roles.everyone.id,
          allow : "SEND_MESSAGES"
        }
      ]
    })
    
    const data = await createDb(guild, client, role.id, muteRole.id)
  })

}

const createDb = async(guild, client, v, m) => {
  await db.collection('guilds').doc(guild.id).set({
    id : guild.id,
    members : guild.memberCount,
    name : guild.name,
    bannedMembers : [],
    verifiedMembers : [],
    ownerId : guild.ownerId,
    prefix : '!',
    owner : await client.users.cache.find(user => user.id === guild.ownerId).username,
    verifiedRoleId : v,
    muteRoleId : m
  })
}