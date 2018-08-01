module.exports = {
  notificationsChangesQueue: process.env.NOTIFICATIONS_CHANGES_QUEUE,
  responseQueue: process.env.RESPONSE_QUEUE,
  comparatorQueue: process.env.COMPARATOR_QUEUE,
  rabbitReconnectInterval: process.env.RABBIT_RECONNECT_INTERVAL
}
