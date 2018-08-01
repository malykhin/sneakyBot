const mongoose = require('mongoose')

const config = require('./config')

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true, 
  dbName: config.dbName
})
mongoose.Promise = global.Promise
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error))
