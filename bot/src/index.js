'use strict'

const Telegraf = require('telegraf')

require('../../common/db')
const queue = require('../../common/queue')
const qMessages = require('../../common/qMessages')
const {
  start,
  help,
  url,
  selector,
  stop
} = require('./botHandlers')
const config = require('./config')
const messages = require('./messages')


const bot = new Telegraf(config.botToken)

bot.start(start)
bot.help(help)
bot.command('url', url)
bot.command('selector', selector)
bot.command('stop', stop)
bot.startPolling()

const subscribeToResponseQueue = async () => {
  try {
    const consumeEmmitter = await queue.consume(config.responseQueue)

    consumeEmmitter.on('data', async message => {
      const messageArr = message.split('/')
      const type = messageArr[0]
      const chatId = messageArr[1]

      if (type === qMessages.changesDetected) {
        bot.telegram.sendMessage(chatId, messages.changeDetected)
      }
      if (type === qMessages.fetchError) {
        bot.telegram.sendMessage(chatId, messages.fetchError)
      }
    })
    consumeEmmitter.on('error', error => console.error(error))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const intervalId = setInterval( () => {
  subscribeToResponseQueue()
    .then(isConnected => {
      if (isConnected) {
        clearInterval(intervalId)
        console.log('Bot is up')
      }
    })
}, config.rabbitReconnectInterval)
