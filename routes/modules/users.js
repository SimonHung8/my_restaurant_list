const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register',
  body('email').isEmail(),
  (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = validationResult(req)
    const errorMsg = []
    if (!errors.isEmpty()) {
      errorMsg.push({message: '請輸入有效email'})
    }
    if(!password) {
      errorMsg.push({message: '請輸入密碼'})
    }
    if(confirmPassword !== password) {
      errorMsg.push({message: '密碼與確認密碼不相符'})
    }
    if(errorMsg.length) {
      return res.render('register', { errorMsg, name, email, password, confirmPassword })
    }
    User.findOne({ email })
      .then(user => {
        if (user) {
          errorMsg.push({message: '已註冊過的使用者'})
          return res.render('register', { errorMsg, name, email, password, confirmPassword })
        }
        return bcrypt
          .genSalt(5)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => User.create({name, email, password: hash}))
          .then(() => res.redirect('/'))
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
router.get('/logout', (req, res) => {
  req.logOut(() => {
    req.flash('success_msg', '你已經成功登出')
    res.redirect('/users/login')
  })
})

module.exports = router