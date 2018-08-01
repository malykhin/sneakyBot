const cheerio = require('cheerio')

function parseHTML (html, selector) {
  const $ = cheerio.load(html)
  return $(selector)
    .map(function () {
      return ($(this).html() || '').replace(/\s+/g, ' ')
    } 
  ).get().join(', ')
}

module.exports = {
  parseHTML
}
