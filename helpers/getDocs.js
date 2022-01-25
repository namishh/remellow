const db = require("../db/database")

module.exports = async(col) => {
  let data = await db.collection(col).get()
  data = data.docs.map(doc => doc.data())
  return data
}