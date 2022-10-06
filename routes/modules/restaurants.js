const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router