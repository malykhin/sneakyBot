const start = `
Welcome!
This bot is really sneaky!
Please add url and query selector to start.
Send /help for info.
`

const help = `
/start to create Notification
/url - http(s)://example.com
/selector to set up the query selector
/stop to remove Notification
`

const url = `
URL configured.
`

const selector = `
Selector changed.
`

const stop = `
Notification removed.
`

const exists = `
Notification already exists.
`

const notExists = `
Notification not exists, run /start
`

const fetchError = `
Selected url can't be fetched!
`

const changeDetected = `
Change in selected contend detected!
`

const invalidUrl = `
Please, enter valid url
`

module.exports = {
  start,
  help,
  url,
  selector,
  stop,
  exists,
  notExists,
  fetchError,
  changeDetected,
  invalidUrl,
}
