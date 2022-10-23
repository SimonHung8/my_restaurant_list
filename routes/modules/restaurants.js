const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/',
  body('name').isLength({ min: 1 }),
  body('category').isLength({ min: 1 }),
  body('image').isURL(),
  body('location').isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('error', { invalidRestaurant: true })
    }
    req.body.userID = req.user._id
    Restaurant.create(req.body)
      .then(() => res.redirect('/'))
      .catch(err => {
        console.log(err)
        res.render('error')
      })
  })

router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userID = req.user._id
  Restaurant.findOne({_id, userID})
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userID = req.user._id
  Restaurant.findOne({_id, userID})
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

router.put('/:id',
  body('name').isLength({ min: 1 }),
  body('category').isLength({ min: 1 }),
  body('image').isURL(),
  body('location').isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('error', { invalid: true })
    }
    const _id = req.params.id
    const userID = req.user._id
    Restaurant.findOneAndUpdate({_id, userID}, req.body)
      .then(() => res.redirect(`/restaurants/${_id}`))
      .catch(err => {
        console.log(err)
        res.render('error')
      })
  })

router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userID = req.user._id
  Restaurant.findOneAndDelete({_id, userID})
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

module.exports = router