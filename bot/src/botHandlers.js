const Notification = require('../../common/Notification')
const queue = require('../../common/queue')
const utils = require('../../common/utils')
const qMessages = require('../../common/qMessages')

const config = require('./config')
const messages = require('./messages')

const isNotificationExists = async (chatId, ctx) => {
  if ( await Notification.findOne({chatId}) ) {
    ctx.reply(messages.exists)
    return true
  }
  return false
}

const isNotificationNotExists = async (chatId, ctx) => {
  if ( !(await Notification.findOne({chatId})) ) {
    ctx.reply(messages.notExists)
    return true
  }
  return false
}

const start = async ctx => {
  try {
    const chatId = ctx.from.id
    const firstName = ctx.from.first_name
    const lastName = ctx.from.last_name
    
    if ( await isNotificationExists(chatId, ctx) ) {
      return
    }
    await Notification.create({
      chatId,
      firstName,
      lastName,
      url: '',
      selector: ''
    })
    const message = `${qMessages.notificationCreated}/${chatId}` 
    await queue.publish(config.notificationsChangesQueue, 'fanout', message)
    ctx.reply(messages.start)
  } catch (error) {
    console.error(error)
    ctx.reply('ERROR')
  }
}

const help = ctx => {
  ctx.reply(messages.help)
}

const url = async ctx => {
  try {
    const chatId = ctx.from.id
    if ( await isNotificationNotExists(chatId, ctx) ) {
      return
    }
    const url = (ctx.update.message.text || '').split(' ')[1]

    if (!utils.isUrl(url)) {
      ctx.reply(messages.invalidUrl)
    }
    await Notification.findOneAndUpdate({chatId}, {$set: {url}})
    const message = `${qMessages.urlChanged}/${chatId}` 
    await queue.publish(config.notificationsChangesQueue, 'fanout', message)
    ctx.reply(messages.url)
  } catch (error) {
    console.error(error)
    ctx.reply('ERROR')
  }
}

const selector = async ctx => {
  try {
    const chatId = ctx.from.id
    if ( await isNotificationNotExists(chatId, ctx) ) {
      return
    }
    const selector = (ctx.update.message.text || '').split(' ')[1]
    await Notification.findOneAndUpdate({chatId}, {$set: {selector}})
    const message = `${qMessages.selectorChanged}/${chatId}` 
    await queue.publish(config.notificationsChangesQueue, 'fanout', message)
    ctx.reply(messages.selector)
  } catch (error) {
    console.error(error)
    ctx.reply('ERROR')
  }
}

const stop = async ctx => {
  try {
    const chatId = ctx.from.id
    if ( await isNotificationNotExists(chatId, ctx) ) {
      return
    }
    await Notification.findOneAndDelete({chatId})
    const message = `${qMessages.notificationRemoved}/${chatId}` 
    await queue.publish(config.notificationsChangesQueue, 'fanout', message)
    ctx.reply(messages.stop)
  } catch (error) {
    console.error(error)
    ctx.reply('ERROR')
  }
}

module.exports = {
  start,
  help,
  url,
  selector,
  stop
}
