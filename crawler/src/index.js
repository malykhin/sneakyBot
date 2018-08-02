const crypto = require('crypto')

const { fetchPage } = require('./request')
const { parseHTML } = require('./parser')
const config = require('./config')
const queue = require('../../common/queue')

const createHash = (string) => crypto.createHash('md5').update(string).digest('hex')

const subscribeToWorkingQueue = async () => {
  try {
    const consumeEmmitter = await queue.consume(config.workerQueue, false, true, 1)

    consumeEmmitter.on('data', async (message, ack) => {
      const { url, selector, chatId} = JSON.parse(message)
      const page = await fetchPage(url).catch(async (error) => {
        const errorResponse = {
          chatId,
          error: `${error.name}: ${error.message}`
        }
        await queue.produce(config.comparatorQueue, JSON.stringify(errorResponse))
        ack()
        throw error
      })
      const parsedString = parseHTML(page, selector)
      const hash = createHash(parsedString)
      const response = {chatId, hash}
      await queue.produce(config.comparatorQueue, JSON.stringify(response))
      ack()
    })

    consumeEmmitter.on('error', error => console.error(error))
    
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const intervalId = setInterval( () => {
  subscribeToWorkingQueue()
    .then(isConnected => {
      if (isConnected) {
        clearInterval(intervalId)
        console.log('Crawler is up')
      }
    })
}, config.rabbitReconnectInterval)
