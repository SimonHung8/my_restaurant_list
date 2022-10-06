// require mongoose, Restaurant model, and seed data 
const db = require('../../config/mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('./restaurants')

db.once('open', () => {
  console.log('MongoDB connected! constructing seed data...')
  Restaurant.insertMany(restaurantList.results)
    .then(() => {
      console.log('seed data constructed!')
      db.close()
    })
    .catch(err => console.log(err))
})