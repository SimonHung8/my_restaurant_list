// require mongoose, Restaurant model, and seed data 
const mongoose = require('mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('./restaurants')

// connect MongoDB via mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('MongoDB connection error')
})
db.once('open', () => {
  console.log('MongoDB connected! constructing seed data...')
  Restaurant.insertMany(restaurantList.results)
    .then(() => {
      console.log('seed data constructed!')
      db.close()
    })
    .catch(err => console.log(err))
})