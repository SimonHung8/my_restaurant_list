const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')
const sortBy = require('../../utilities/sortBy')
const getRandomRestaurants = require('../../utilities/getRandomRestaurants')
const trimmed = require('../../utilities/trimmed')

router.get('/', (req, res) => {
  const sort = req.query.sort
  const homePage = true
  Restaurant.find()
    .lean()
    .sort(sortBy(sort))
    .then(restaurants => {
      res.render('index', { restaurants, homePage })
    })
    .catch(err => console.log(err))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(restaurant => {
        return trimmed(restaurant.name).includes(trimmed(keyword)) ||
          trimmed(restaurant.category).includes(trimmed(keyword))
      })
      const cannotFind = filteredRestaurants.length ? false : true
      const resultRestaurants = filteredRestaurants.length ? filteredRestaurants : getRandomRestaurants(restaurants, 3)
      res.render('index', { restaurants: resultRestaurants, keyword, cannotFind })
    })
    .catch(err => console.log(err))
})

module.exports = router