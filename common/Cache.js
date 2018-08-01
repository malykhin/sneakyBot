const mongoose = require('mongoose')

const Cache = new mongoose.Schema({
  chatId:  String,
  hash: String,
})

module.exports = mongoose.model('Cache', Cache)
