const db = require("../db/database")

module.exports = async(collection, document) => {
  const data =  await db.collection(collection).doc(document).get()
  return data.data()
}