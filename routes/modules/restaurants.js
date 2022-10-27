const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/',
  body('image').isURL(),
  (req, res) => {
    const errors = validationResult(req)
    const errorMsg = []
    const {name, category, location} = req.body
    if(!name || !category || !location) {
      errorMsg.push({message: '請填寫所有必填欄位'})
    }
    if (!errors.isEmpty()) {
      errorMsg.push({message: '請輸入有效圖片連結'})
    }
    if(errorMsg.length) {
      req.body.errorMsg = errorMsg
      return res.render('new', req.body)
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
    .then(restaurant => res.render('edit',  restaurant ))
    .catch(err => {
      console.log(err)
      res.render('error')
    })
})

router.put('/:id',
  body('image').isURL(),
  (req, res) => {
    const errors = validationResult(req)
    const errorMsg = []
    const { name, category, location } = req.body
    if (!name || !category || !location) {
      errorMsg.push({ message: '請填寫所有必填欄位' })
    }
    if (!errors.isEmpty()) {
      errorMsg.push({ message: '請輸入有效圖片連結' })
    }
    if (errorMsg.length) {
      req.body.errorMsg = errorMsg
      req.body._id = req.params.id
      return res.render('edit', req.body)
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