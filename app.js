// require packages used in the project
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes/index')

const app = express()
const port = 3000

// connect MongoDB via mongoose
require('./config/mongoose')

// setting template engine
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// setting session
app.use(session({
  secret: 'secretString',
  resave: false,
  saveUninitialized: true
}))

// setting static css file, body-parser and method-override
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// setting routes
app.use(routes)


// start and listen on the server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
