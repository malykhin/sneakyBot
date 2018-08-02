'use strict'

require('../../common/db')
const Notification = require('../../common/Notification')
const queue = require('../../common/queue')
const utils = require('../../common/utils')
const qMessages = require('../../common/qMessages')
const config = require('./config')

const subscribeToNotifications = async () => {
  try {
    const subscribeEmmitter = await queue.subscribe(config.notificationsChangesQueue, 'fanout')
    
    subscribeEmmitter.on('data', async message => {
      let notification = {}
      const messageArr = message.split('/')
      const type = messageArr[0]
      const chatId = messageArr[1]
      if (type === qMessages.urlChanged || type === qMessages.selectorChanged) {
        notification = await Notification.findOne({chatId}).select('url selector chatId -_id')
      }
      if ( utils.isUrl(notification.url) && notification.selector ) {
        await queue.produce(config.workerQueue, JSON.stringify(notification), true, true)
      }
    })

    subscribeEmmitter.on('error', error => console.error(error))

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const pushToQueue = async () => {
  const query = {
    url: { "$exists": true, $ne: '' },
    selector: { "$exists": true, $ne: '' },
  }
  const notifications = await Notification.find(query).select('url selector chatId -_id')
  for (let notification of notifications) {
    if ( utils.isUrl(notification.url) ) {
      await queue.produce(config.workerQueue, JSON.stringify(notification), true, true)
    }
  }
}

const intervalId = setInterval( () => {
  subscribeToNotifications()
    .then(isConnected => {
      if (isConnected) {
        clearInterval(intervalId)
        console.log('Planner is up')
      }
    })
}, config.rabbitReconnectInterval)

setInterval(pushToQueue, config.updateRate)
