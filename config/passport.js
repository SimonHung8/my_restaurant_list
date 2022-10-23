const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

module.exports = app => {
  // middleware
  app.use(passport.initialize())
  app.use(passport.session())

  // strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({email})
        .then(user => {
          if(!user) {
            return done(null, false, req.flash('warning_msg', '未註冊的email'))
          }
          if(password !== user.password) {
            return done(null, false, req.flash('warning_msg', '帳號或密碼錯誤'))
          }
          return done(null, user)
        })
        .catch(err => {
          console.log(err)
          res.render('error')
        })
    }))
  // session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => {
        done(err)
        res.render('error')
      })
  })
}