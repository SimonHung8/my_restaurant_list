const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 1 }),
  (req, res) => {
    const {name, email, password, confirmPassword} = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.render('error', { invalidUser: true })
    }
    User.findOne({email})
      .then(user => {
        if(user) {
          console.log('user already exist')
          return res.render('register', {name, email, password, confirmPassword})
        }
        User.create({name, email, password, confirmPassword})
          .then(res.redirect('/'))
          .catch(err => {
            console.log(err)
            res.render('error')
          })
      })
      .catch(err => {
        console.log(err)
        res.render('error')
      })
  })

module.exports = router