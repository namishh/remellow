const got = require('got')

module.exports = async(url) => {
  const data = await got(url)
  return JSON.parse(data.body)
}
