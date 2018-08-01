const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  chatId: String,
  firstName: String,
  lastName: String,
  url: String,
  selector: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', NotificationSchema)
