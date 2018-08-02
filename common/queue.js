const amqp = require('amqplib')
const EventEmitter = require('events')

const config = require('./config')

const produce = async (queue, message, durable = false, persistent = false) => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()

  await channel.assertQueue(queue, { durable })
  await channel.sendToQueue(queue, Buffer.from(message), { persistent })

  console.log('Message produced: ', queue, message)
}

const consume = async (queue, isNoAck = false, durable = false, prefetch = null) => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()

  await channel.assertQueue(queue, { durable })

  if (prefetch) {
    channel.prefetch(prefetch)
  }
  const consumeEmitter = new EventEmitter()
  try {
    channel.consume(queue, message => {
      if (message !== null) {
        consumeEmitter.emit('data', message.content.toString(), () => channel.ack(message))
      } else {
        const error = new Error('NullMessageException')
        consumeEmitter.emit('error', error)
      }
    }, {noAck: isNoAck})
  } catch (error) {
    consumeEmitter.emit('error', error)
  }
  return consumeEmitter
}

const publish = async (exchangeName, exchangeType, message) => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()

  await channel.assertExchange(exchangeName, exchangeType, {durable: false})
  await channel.publish(exchangeName, '', Buffer.from(message))

  console.log('Message published: ', exchangeName, message)
}

const subscribe = async (exchangeName, exchangeType) => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()

  await channel.assertExchange(exchangeName, exchangeType, {durable: false})
  const queue = await channel.assertQueue('', {exclusive: true})
  channel.bindQueue(queue.queue, exchangeName, '')
  const consumeEmitter = new EventEmitter()

  try {
    channel.consume(queue.queue, message => {
      if (message !== null) {
        consumeEmitter.emit('data', message.content.toString())
      } else {
        const error = new Error('NullMessageException')
        consumeEmitter.emit('error', error)
      }
    }, {noAck: true})
  } catch (error) {
    consumeEmitter.emit('error', error)
  }
  return consumeEmitter
}

module.exports = {
  produce,
  consume,
  publish,
  subscribe
}
