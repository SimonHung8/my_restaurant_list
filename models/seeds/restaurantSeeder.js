// require mongoose, Restaurant model, and seed data 
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Restaurant = require('../Restaurant')
const User = require('../User')
const restaurantList = require('./restaurants').results
const userList = require('./user').results

db.once('open', () => {
  Promise.all(userList.map(data => {
    return User.create({
      name: data.name,
      email: data.email,
      password: bcrypt.hashSync(data.password, 5)
    })
      .then(user => {
        const restaurants = []
        restaurantList.forEach(restaurant => {
          if (data.id * 3 >= restaurant.id && (data.id - 1) * 3 < restaurant.id) {
            restaurant.userID = user._id
            restaurants.push(restaurant)
          }
        })
        return Restaurant.insertMany(restaurants)
      })
      .catch(err => console.log(err))
  }))
    .then(() => {
      console.log('seed data constructed!')
      process.exit()
    })
    .catch(err => console.log(err))
})