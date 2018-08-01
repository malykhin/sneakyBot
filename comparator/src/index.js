require('../../common/db')
const config = require('./config')
const queue = require('../../common/queue')
const Cache = require('../../common/Cache')
const qMessages = require('../../common/qMessages')

const subscribeToComparatorQueue = async () => {
  try {
    const consumeEmmitter = await queue.consume(config.comparatorQueue)

    consumeEmmitter.on('data', async message => {
      const { error, hash, chatId } = JSON.parse(message)

      if (error) {
        const message = `${qMessages.fetchError}/${chatId}` 
        await queue.produce(config.responseQueue, message)
      }

      const previous = await Cache.findOne({chatId})

      if ( previous && hash !== previous.hash ) {
        await Cache.findOneAndUpdate({chatId}, {$set: {hash}})
        const message = `${qMessages.changesDetected}/${chatId}`
        await queue.produce(config.responseQueue, message)
      }
      if (!previous) {
        await Cache.create({chatId, hash})
      }
    })

    consumeEmmitter.on('error', error => console.error(error))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const subscribeToNotifications = async () => {
  try {
    const subscribeEmmitter = await queue.subscribe(config.notificationsChangesQueue, 'fanout')

    subscribeEmmitter.on('data', async message => {
      const messageArr = message.split('/')
      const type = messageArr[0]
      const chatId = messageArr[1]

      if (type === qMessages.urlChanged || type === qMessages.selectorChanged) {
        await Cache.findOneAndDelete({chatId})
      }
    })

    subscribeEmmitter.on('error', error => console.error(error))
    
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const comparatorIntervalId = setInterval( () => {
  subscribeToComparatorQueue()
    .then(isConnected => {
      if (isConnected) {
        clearInterval(comparatorIntervalId)
        console.log('Comparator is up')
      }
    })
}, config.rabbitReconnectInterval)

const notificationsIntervalId = setInterval( () => {
  subscribeToNotifications()
    .then(isConnected => {
      if (isConnected) {
        clearInterval(notificationsIntervalId)
        console.log('Connected to notifications')
      }
    })
}, config.rabbitReconnectInterval)
