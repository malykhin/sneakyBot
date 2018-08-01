module.exports = {
  workerQueue: process.env.WORKER_QUEUE,
  comparatorQueue: process.env.COMPARATOR_QUEUE,
  rabbitReconnectInterval: process.env.RABBIT_RECONNECT_INTERVAL
}
