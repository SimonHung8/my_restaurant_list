const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')
const sortBy = require('../../utilities/sortBy')

router.get('/', (req, res) => {
  const {sort, keyword} = req.query
  const userID = req.user._id
  // 有搜尋關鍵字的狀況
  if (keyword) {
    const regKeyword = new RegExp(keyword.trim(), 'gi')
    return Restaurant.find({
      $and: [
        {userID},
        {$or: [{ name: regKeyword }, { category: regKeyword }]}
      ]
    })
      .lean()
      .sort(sortBy(sort))
      .then(restaurants => {
        if (!restaurants.length) {
          Restaurant.countDocuments({userID})
            .then(count => {
              if(!count) {
                return res.redirect('/')
              }
              const randomIndex = Math.floor(Math.random() * count)
              Restaurant.findOne()
              .skip(randomIndex)
              .lean()
              .then( restaurant => {
                res.render('index', {restaurants: [restaurant], cannotFind: true, keyword})
              })
              .catch(err => {
                console.log(err)
                res.render('error')
              })
            })
        } else {
          return res.render('index', { restaurants, keyword })
        }
      })
      .catch(err => {
        console.log(err)
        res.render('error')
      })
    // 沒有搜尋關鍵字的狀況
  } else {
    return Restaurant.find({userID})
      .lean()
      .sort(sortBy(sort))
      .then(restaurants => {
        res.render('index', { restaurants })
      })
      .catch(err => {
        console.log(err)
        res.render('error')
      })
  }
})

module.exports = router