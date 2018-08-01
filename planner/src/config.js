module.exports = {
  workerQueue: process.env.WORKER_QUEUE,
  notificationsChangesQueue: process.env.NOTIFICATIONS_CHANGES_QUEUE,
  updateRate: process.env.UPDATE_RATE,
  rabbitReconnectInterval: process.env.RABBIT_RECONNECT_INTERVAL
}
