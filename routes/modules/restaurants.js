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
      return res.render('error', { invalid: true })
    }
    Restaurant.create(req.body)
      .then(() => res.redirect('/'))
      .catch(err => {
        console.log(err)
        res.render('error')
      })
  })

router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
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
    const id = req.params.id
    Restaurant.findByIdAndUpdate(id, req.body)
      .then(() => res.redirect(`/restaurants/${id}`))
      .catch(err => {
        console.log(err)
        res.render('error')
      })
  })

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

module.exports = router